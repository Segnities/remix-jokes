import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import stylesUrl from "~/styles/jokes.css";

import { db } from "utils/db.server";
import { getUser } from "utils/session.server";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({ request }: LoaderArgs) => {
    const jokeListItems = await db.joke.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true },
        take: 5,
    });
    const user = await getUser(request);

    return json({ jokeListItems, user })
};

export default function Jokes() {
    const data = useLoaderData<typeof loader>();
    return (
        <div className="jokes-layout">
            <header>
                <div className="container">
                    <h1>
                        <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
                            <span className="logo-medium">J🤪KES</span>
                        </Link>
                    </h1>
                    {
                        data.user ? (
                            <div className="user-info">
                                <span>{`Hi ${data.user.username}`}</span>
                                <Form action="/logout" method="post">
                                    <button type="submit" className="button">
                                        Logout
                                    </button>
                                </Form>
                            </div>
                        ) : (
                            <Link to="/login" className="button" role="button">Login</Link>
                        )
                    }
                </div>
            </header >
            <main className="jokes-main">
                <div className="container">
                    <div className="jokes-list">
                        <Link to=".">Get a random joke</Link>
                        <p>Here to are few more jokes to check out:</p>
                        <ul>
                            {
                                data.jokeListItems.map(({ id, name }) => (
                                    <li key={id}>
                                        <Link to={id}>{name}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                        <Link to="new" className="button" role="button">Add your own</Link>
                    </div>
                    <div className="jokes-outlet">
                        <Outlet />
                    </div>
                </div>
            </main>
            <footer className="jokes-footer">
                <div className="container">
                    <Link reloadDocument to="/jokes.rss">RSS</Link>
                </div>
            </footer>
        </div >
    )
}
