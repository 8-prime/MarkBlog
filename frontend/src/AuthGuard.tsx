import { Navigate } from "react-router";
import isLoggedIn from "./hooks/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const loggedIn = isLoggedIn();

    if (!loggedIn) {
        Navigate({ to: "/login" })
        return <></>
    }
    return <>{children}</>
}