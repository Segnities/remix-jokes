import { Outlet } from "@remix-run/react";

export default function JokesIndexRoute() {
    return (
        <div>
            <p>Here are your Jokes!</p>
            <p>I was wondering why the frisbee was getting bigger, then it hit me</p>
            <Outlet />
        </div>
    )
}