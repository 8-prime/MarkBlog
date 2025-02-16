import { useState } from "react";
import { useAuthStore } from "../state/AuthStore";

export default function ChangePassword() {

    const [newPassword, setNewPassword] = useState<string>("");
    const pwChangeInfo = useAuthStore((store) => store.passwordChangeInfo)

    const changePassword = useAuthStore((store) => store.changePassword);

    const onSubmit = async () => {
        if (!pwChangeInfo) return;
        changePassword({ newPassword: newPassword, resetCode: pwChangeInfo.resetCode, user: pwChangeInfo.user })
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        disabled
                        className="text-neutral-500 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-neutral-500"
                        value={'admin'}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                        New Password
                    </label>
                    <input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                        id="password"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-neutral-500"
                        required
                    />
                </div>
                <button
                    className="w-full px-5 py-2.5 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors"
                    onClick={onSubmit}
                >
                    Change Password
                </button>
            </div>
        </div>
    );
}