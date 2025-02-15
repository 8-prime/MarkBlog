import { Navigate } from "react-router";
import { useBlogStore } from "../state/Store";
import { LoginState } from "../models/Authentication";
import { useEffect } from "react";
import { useAuthStore } from "../state/AuthStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const loginState = useAuthStore((store) => store.loginState)

    useEffect(() => {
        console.log(loginState);

    }, [loginState])

    if (!loginState || loginState === LoginState.LOGGED_OUT) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute