import { Navigate } from "react-router";

const handleLogin = () => {
    window.location.href = "/api/auth/google"
    // fetch("/api/auth/google").then(() => Navigate({ to: "/" })).catch(_ => Navigate({ to: "/bad" }))
}

export default function Login() {
    return (
        <div>
            <button onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}