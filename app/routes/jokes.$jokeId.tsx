import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import {
    Link,
    isRouteErrorResponse,
    useLoaderData,
    useRouteError,
    useParams
} from "@remix-run/react";

import { db } from "utils/db.server";
import { getUserId, requireUserId } from "utils/session.server";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
    const { title, description } = data ?
        {
            description: `Enjoy your "${data.joke.name}" joke and much more`,
            title: `${data.joke.name} joke`,
        } :
        {
            description: "Not Found",
            title: "Not Found"
        };
    return [
        { name: "description", content: description },
        { name: "twitter:description", content: description },
        { title }
    ];
}

export const action = async ({ params, request }: ActionArgs) => {
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent !== "delete") {
        throw new Response(`The intent ${intent} is not supported`, {
            status: 400
        });
    }
    const userId = await requireUserId(request);
    const joke = await db.joke.findUnique({
        where: {
            id: params.jokeId
        },
    });
    if (!joke) {
        throw new Response("Can't delete what doesn't exist", {
            status: 404
        });
    }

    if (joke.jokesterId !== userId) {
        throw new Response("Psshh, nice try. That's not your joke. You can't delete it", {
            status: 403
        });
    }
    await db.joke.delete({
        where: {
            id: params.jokeId
        }
    });
    return redirect("/jokes");

}

export const loader = async ({ params, request }: LoaderArgs) => {
    const userId = await getUserId(request);
    const joke = await db.joke.findUnique({
        where: {
            id: params.jokeId,
        },
        select: {
            name: true,
            content: true,
            jokesterId: true,
        }
    });

    if (!joke) {
        throw new Response("What a joke? Not found", {
            status: 404
        });
    }

    return json({
        isOwner: userId === joke.jokesterId,
        joke
    });
}

export default function UniqueJoke() {
    const { joke, isOwner } = useLoaderData<typeof loader>();
    return (
        <section>
            <h3>Here is our hillarious joke</h3>
            <p>{joke?.content}</p>
            {
                isOwner ? (
                    <form method="post">
                        <button
                            name="intent"
                            type="submit"
                            value="delete"
                            className="button"
                        >
                            Delete
                        </button>
                    </form>
                ) : null
            }
            <Link to=".">"{joke.name}" Permalink</Link>
        </section>
    );
}

export function ErrorBoundary() {
    const { jokeId } = useParams();
    const error = useRouteError();
    console.error(error);

    if (isRouteErrorResponse(error)) {
        if (error.status === 400) {
            return (
                <div className="error-container">
                    <p>What you're trying to do is not allowed.</p>
                </div>
            );
        }
        if (error.status === 403) {
            return (
                <div className="error-container">
                    You don't have permission to delete this joke. Sorry, but "{jokeId}" is not you're joke.
                </div>
            );
        }
        if (error.status === 404) {
            return (
                <div className="error-container">
                    <p> Huh? What is heck is "{jokeId}"</p>
                </div>
            );
        }
    }

    return (
        <div className="error-container">
            There was an error loading joke by id "{jokeId}". Sorry 😭
        </div>
    )
}