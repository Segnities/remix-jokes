import {Link, Outlet, useLoaderData} from "@remix-run/react";
import type {LinksFunction} from "@remix-run/node";
import {json} from "@remix-run/node";

import stylesUrl from "~/styles/jokes.css";

import {db} from "../../utils/db.server";

export const links: LinksFunction = () => [
    {rel: "stylesheet", href: stylesUrl},
];

export const loader = async () => {
    return json({
        jokeListItems: await db.joke.findMany({
            orderBy: {createdAt: "desc"},
            select: {id: true, name: true},
            take: 5,
        })
    });
};

export default function JokesRoute() {
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
                </div>
            </header>
            <main className="jokes-main">
                <div className="container">
                    <div className="jokes-list">
                        <Link to=".">Get a random joke</Link>
                        <p>Here to are few more jokes to check out:</p>
                        <ul>
                            {
                                data.jokeListItems.map(({id, name}) => (
                                    <li key={id}>
                                        <Link to={id}>{name}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                        <Link to="new" className="button" role="button">Add your own</Link>
                    </div>
                    <div className="jokes-outlet">
                        <Outlet/>
                    </div>
                </div>
            </main>
        </div>
    )
}
