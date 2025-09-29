const handleLogin = () => {
    window.location.href = "/api/auth/google"
}

export default function Login() {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-background">
            <button
                className="flex items-center gap-2 px-3 py-2 bg-primary text-background hover:bg-primary/80 transition-colors"
                onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}