import {
    Link,
    Outlet,
    isRouteErrorResponse,
    useLoaderData,
    useRouteError
} from "@remix-run/react";

import { db } from "../../utils/db.server";
import { json } from "@remix-run/node";

export const loader = async () => {
    const count = await db.joke.count();
    const randomRowNum = Math.floor(Math.random() * count);
    const [randomJoke] = await db.joke.findMany({
        skip: randomRowNum,
        take: 1,
    });

    if (!randomJoke) {
        throw new Response("No random joke found", {
            status: 404
        });
    }

    return json({
        randomJoke,
    });
}

export default function JokesWrapper() {
    const { randomJoke } = useLoaderData<typeof loader>();
    return (
        <section>
            <h3>Here are your Jokes!</h3>
            <p>{randomJoke.content}</p>
            <Link to=".">"{randomJoke.name}" Permalink</Link>
            <Outlet />
        </section>
    )
}

export function ErrorBoundary() {
    const error = useRouteError();

    if(isRouteErrorResponse(error)) {
        return (
            <div className="error-container">
                <h3>Oopsies! There no jokes to display.</h3>
                <p>{error.data.message}</p>
                <Link to="new">You can add one now</Link>
            </div>
        ) 
    
    } 

    

    return (
        <div className="error-container">
            I did a whoopsies...
        </div>
    );
}
