import { useEffect, useState } from "react";

export default function isLoggedIn(): boolean {
    const [loggedIn, setLoggedIn] = useState(false)
    useEffect(() => {
        fetch("/api/user")
            .then(response => response.json())
            .then(_ => {
                setLoggedIn(true)
            })
            .catch(_ => {
                setLoggedIn(false)
            })
    }, [])
    return loggedIn
}