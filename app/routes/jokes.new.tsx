export default function NewJokeRoute() {
    return (
        <div>
            <h3>Add your own hilarious joke!</h3>
            <form method="post" onSubmit={(e) => {
                e.preventDefault();
            }}>
                <div>
                    <label htmlFor="author">Name:</label>
                    <input type="text" id="author" />
                </div>
                <div>
                    <label htmlFor="jokeText">Content:</label>
                    <textarea id="jokeText" />
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}