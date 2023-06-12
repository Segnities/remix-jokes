import type { ActionArgs, LinksFunction } from "@remix-run/node";
import { Link, useActionData, useSearchParams } from "@remix-run/react";

import styleUrl from "~/styles/login.css";

import { badRequest } from "utils/request.server";
import { db } from "utils/db.server";
import { login } from "utils/session.server";

const validateUsername = (username: string) => {
    if (username.length < 3) {
        return "Username must be at least 3 characters long.";
    }
};

const validatePassword = (password: string) => {
    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }
};

const validateUrl = (url: string) => {
    const urls = ['/jokes', '/'];

    if (urls.includes(url)) {
        return url;
    }
    return "/jokes";
};

export const links: LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: styleUrl },
    ]
};

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const loginType = form.get("loginType");
    const password = form.get("password");
    const username = form.get("username");
    const redirectTo = validateUrl(form.get("redirectTo") as string || "/jokes");

    if (
        typeof loginType !== "string" ||
        typeof password !== "string" ||
        typeof username !== "string"
    ) {
        return badRequest({
            fieldErrors: null,
            fields: null,
            formError: "Form submitted not correctly.",
        });
    }

    const fields = { loginType, password, username };
    const fieldErrors = {
        username: validateUsername(username),
        password: validatePassword(password),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({
            fieldErrors,
            fields,
            formError: null,
        });
    }

    switch (loginType) {
        case "login": {
            const user = await  ({ username, password });
            console.log({ user });
            if (!user) {
                return badRequest({
                    fieldErrors: null,
                    fields,
                    formError: "Username/Password combination incorrect",
                });

            }
            return badRequest({
                fieldErrors: null,
                fields,
                formError: "Not implemented",
            });

        };
        case "register": {
            const userExists = await db.user.findFirst({
                where: { username }
            });
            if (userExists) {
                return badRequest({
                    fieldErrors: null,
                    fields,
                    formError: `User with username ${username} already exists.`,
                });
            }
        };
        default: {
            return badRequest({
                fieldErrors: null,
                fields,
                formError: "Login type invalid.",
            })
        }

    }

};

export default function Login() {
    const actionData = useActionData<typeof action>();
    const [searchParams] = useSearchParams();

    return (
        <div className="container">
            <div className="content" data-light="">
                <h1>Login</h1>
                <form method="post">
                    <input
                        type="hidden"
                        name="redirectTo"
                        value={
                            searchParams.get("redirectTo") ?? undefined
                        }
                    />
                    <fieldset>
                        <legend className="sr-only">
                            Login or Register?
                        </legend>
                        <label>
                            <input
                                type="radio"
                                name="loginType"
                                value="login"
                                defaultChecked={
                                    !actionData?.fields?.loginType || actionData.fields.loginType === "login"
                                }
                            />
                            Login
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="loginType"
                                value="register"
                                defaultChecked={actionData?.fields?.loginType === "register"}
                            />
                            Register
                        </label>
                    </fieldset>
                    <div>
                        <label htmlFor="username-input">Username</label>
                        <input
                            type="text"
                            id="username-input"
                            name="username"
                            defaultValue={actionData?.fields?.username}
                            aria-invalid={Boolean(actionData?.fieldErrors?.username)}
                            aria-errormessage={actionData?.fieldErrors?.username ? "username-error" : undefined}
                        />
                        {actionData?.fieldErrors?.username ? (
                            <p className="form-validation-error" id="username-error" role="alert">
                                {actionData.fieldErrors.username}
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="password-input">Password</label>
                        <input
                            id="password-input"
                            name="password"
                            type="password"
                            defaultValue={actionData?.fields?.password}
                            aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                            aria-errormessage={actionData?.fieldErrors?.password ? "password-error" : undefined}
                        />
                        {
                            actionData?.fieldErrors?.password ? (
                                <p
                                    className="form-validation-error" role="alert" id="password-error">
                                    {actionData.fieldErrors.password}
                                </p>
                            ) : null
                        }
                    </div>
                    <button type="submit" className="button">
                        Submit
                    </button>
                </form>
            </div>
            <div className="links">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/jokes">Jokes</Link>
                    </li>
                </ul>
            </div>
        </div>

    );
}