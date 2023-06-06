import {ActionArgs, redirect} from "@remix-run/node";

import {db} from "../../utils/db.server";

export async function action({ request }:ActionArgs){
    const formData = await request.formData();
    const name = formData.get("name");
    const content = formData.get("content");

    if(typeof name !== "string" || typeof content !== "string"){
        throw new Error("Form not submitted correctly!");
    }

    const fields = {name, content};


    const joke = await db.joke.create({
        data: fields
    });

    return redirect(`/jokes/${joke.id}`)

}
export default function NewJokeRoute() {
    return (
        <div>
            <h3>Add your own hilarious joke!</h3>
            <form method="post" onSubmit={(e) => {
                e.preventDefault();
            }}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required/>
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea id="content"  name="content" required />
                </div>
                <button type="submit" className="button">Add</button>
            </form>
        </div>
    )
}
