
import type { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesUrl }
];

export default function IndexRoute() {
    return (
        <>
            <h1>Meow meow nigga!</h1>
        </>
    );
}