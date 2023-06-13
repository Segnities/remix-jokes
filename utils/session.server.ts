import bcrypt from "bcryptjs";

import { db } from "./db.server";
import {createCookieSessionStorage, redirect} from "@remix-run/node";
import * as process from "process";

type LoginForm = {
    password: string;
    username: string;
}

export async function login({ username, password }: LoginForm) {
    const user = await db.user.findUnique({
        where: { username }
    });

    if (!user) {
        return null;
    }

    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isCorrectPassword) {
        return null;
    }

    return { id: user.id, username }
}

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
    cookie: {
        name: "RJ_jokes",
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    }
});

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set("userId", userId);

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        }
    });
}

function getUserSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const userId = session.get("userId");

    if(!userId || typeof userId !== "string") {
        return null;
    }
    return userId;
}

export async function requireUserId(request:Request, redirectTo: string = new URL(request.url).pathname) {
    const session = await storage.getSession();
    const userId = session.get("userId");

    if(!userId || typeof userId !== "string") {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
        throw redirect(`/login?${searchParams}`);
    }

    return userId;
}
