function Unauthorized() {
    return (
        <div className="w-screen h-screen bg-background flex justify-center items-center">
            <h1 className="text-text">You are not authorized to edit articles here</h1>
            <a href="/" className="text-primary">Go back to viewing articles</a>
        </div>
    )
}

export default Unauthorized