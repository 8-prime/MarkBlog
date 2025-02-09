
export default function ChangePassword() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
                <form>
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
                            type="password"
                            id="password"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-neutral-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-5 py-2.5 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
}