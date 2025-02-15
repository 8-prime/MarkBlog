import { useState } from "react";
import { useAuthStore } from "../state/AuthStore";

export default function Login() {

    const [user, setUser] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const login = useAuthStore((store) => store.login)

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                        Username
                    </label>
                    <input
                        value={user}
                        onChange={e => setUser(e.target.value)}
                        type="text"
                        id="username"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                        Password
                    </label>
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        id="password"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    onClick={() => login({ username: user, password: password })}
                    type="submit"
                    className="w-full px-5 py-2.5 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors"
                >
                    Login
                </button>
            </div>
        </div>
    );
}