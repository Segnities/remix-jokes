
import { Link, Outlet } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/jokes.css";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesUrl },
];

export default function JokesRoute() {
    return (
        <div className="jokes-layout">
            <header>
                <div className="container">
                    <h1>
                        <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
                            <span className="logo">🤪</span>
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
                            <li>
                                <Link to="some-joke-id">Programming</Link>
                            </li>
                        </ul>
                        <Link to="new" className="button" role="button">Add your own</Link>
                    </div>
                    <div className="jokes-outlet">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}