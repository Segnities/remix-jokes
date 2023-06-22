import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, isRouteErrorResponse, useActionData, useRouteError } from "@remix-run/react";

import { db } from "../../utils/db.server";
import { getUserId, requireUserId } from "../../utils/session.server";
import { badRequest } from "../../utils/request.server";
import Login from "./login";


function validateJokeName(name: string) {
    if (name.length < 3) {
        return `This joke's name is too short`;
    }
}

function validateJokeContent(content: string) {
    if (content.length < 10) {
        return `This joke is too short`;
    }
}

export const loader = async ({ request }: LoaderArgs) => {
    const userId = await getUserId(request);
    if (!userId) {
        throw new Response("Not logged in/Unauthorized", { status: 401 });
    }

    return json({});
}

export const action = async ({ request }: ActionArgs) => {
    const userId = await requireUserId(request);

    const formData = await request.formData();
    const name = formData.get("name");
    const content = formData.get("content");

    if (
        typeof name !== "string" ||
        typeof content !== "string"
    ) {
        return badRequest({
            fieldErrors: null,
            fields: null,
            formError: "Form not submitted correctly"
        });
    }

    const fieldErrors = {
        name: validateJokeName(name),
        content: validateJokeContent(content)
    };

    const fields = { name, content };

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors, fields, formError: null });
    }

    const joke = await db.joke.create({
        data: { ...fields, jokesterId: userId }
    });

    return redirect(`/jokes/${joke.id}`);
}

export default function NewJoke() {
    const actionData = useActionData<typeof action>();
    return (
        <div>
            <h2>Add your hilarious joke</h2>
            <form method="post">
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        defaultValue={actionData?.fields?.name}
                        name="name"
                        type="text"
                        aria-invalid={Boolean(actionData?.fieldErrors?.name)}
                        aria-errormessage={actionData?.fieldErrors?.name ? "name-error" : undefined
                        }
                    />
                    {actionData?.fieldErrors?.name ? (
                        <p
                            role="alert"
                            id="name-error"
                            className="form-validation-error"
                        >
                            {actionData?.fieldErrors?.name}
                        </p>
                    ) : null}
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        defaultValue={actionData?.fields?.content}
                        name="content"
                        aria-invalid={Boolean(actionData?.fieldErrors?.content)}
                        aria-errormessage={actionData?.fieldErrors?.content ? "content-error" : undefined}
                    />
                    {actionData?.fieldErrors?.content ? (
                        <p
                            className="form-validation-error"
                            id="content-error"
                            role="alert"
                        >
                            {actionData.fieldErrors.content}
                        </p>
                    ) : null}
                </div>
                <div>
                    {actionData?.formError ? (
                        <p
                            className="form-validation-error"
                            id="content-error"
                            role="alert"
                        >
                            {actionData.formError}
                        </p>
                    ) : null}
                    <button type="submit" className="button">Add</button>
                </div>
            </form>
        </div>
    );
}


export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error) && error.status === 401) {
        return (
            <div className="error-container">
                <p>You must be logged in to create a joke</p>
                <Link to="/login">Login</Link>
            </div>
        )
    }
    return (
        <div className="error-container">
            Something unexpected went wrong. Sorry about that 😭...
        </div>
    )
}