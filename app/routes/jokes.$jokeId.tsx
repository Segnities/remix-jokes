import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";

import {
    Link,
    isRouteErrorResponse,
    useLoaderData,
    useParams,
    useRouteError
} from "@remix-run/react";

import { db } from "utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
    console.log(params)
    const joke = await db.joke.findUnique({
        where: {
            id: params.jokeId,
        },
        select: {
            name: true,
            content: true
        }
    });

    if (!joke) {
        throw new Response("What a joke? Not found", {
            status: 404
        });
    }

    return json({
        joke
    });
}

export default function UniqueJoke() {
    const { joke } = useLoaderData<typeof loader>();
    return (
        <section>
            <h3>Here is our hillarious joke</h3>
            <p>{joke?.content}</p>
            <Link to=".">"{joke.name}" Permalink</Link>
        </section>
    );
}

export function ErrorBoundary() {
    const { jokeId } = useParams();
    const error = useRouteError();

    if (isRouteErrorResponse(error) && error.status === 404) {
        return (
            <div className="error-container">
                Huh? What is heck is "{jokeId}"
            </div>
        );
    }

    return (
        <div className="error-container">
            There was an error loading joke by id "{jokeId}". Sorry 😭
        </div>
    )
}