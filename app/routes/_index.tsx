import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import styleUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: styleUrl }];
};

export default function IndexRoute() {
    return (
        <div className="container">
            <div className="content">
                <h1>Remix <span>Jokes</span></h1>
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="jokes">Read jokes</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}