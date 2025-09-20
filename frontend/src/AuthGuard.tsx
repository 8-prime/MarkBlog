import Login from "./pages/Login";

type AuthGuardProps = {
    loggedIn: boolean,
    children: React.ReactNode
}

export default function AuthGuard({ loggedIn, children }: AuthGuardProps) {

    if (!loggedIn) {
        return <Login />
    }
    return <>{children}</>
}