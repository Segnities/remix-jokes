import {Link, Outlet, useLoaderData} from "@remix-run/react";

import { db } from "../../utils/db.server";
import {json} from "@remix-run/node";

export const loader = async () => {
    const count = await db.joke.count();
    const randomRowNum = Math.floor(Math.random() * count);
    const [randomJoke] = await db.joke.findMany({
        skip: randomRowNum,
        take: 1,
    });

    if(!randomJoke) {
        throw new Error("No Jokes found");
    }

    return json({
        randomJoke,
    });
}

export default function JokesWrapper() {
    const {randomJoke} = useLoaderData<typeof loader>();
    return (
        <section>
            <h3>Here are your Jokes!</h3>
            <p>{randomJoke.content}</p>
            <Link to=".">"{randomJoke.name}" Permalink</Link>
            <Outlet />
        </section>
    )
}
