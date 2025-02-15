import { NavLink, Outlet } from "react-router";

export function Management() {
    return (
        <div className="w-screen h-screen bg-neutral-50 text-neutral-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <header className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-8">
                    <h1 className="text-4xl font-light tracking-tight">Blog Management</h1>
                </header>
                <div className="grid grid-cols-12 gap-8">
                    <nav className="col-span-3 space-y-2">
                        <NavLink to="/" className={({ isActive }) => `block py-3 px-4 rounded-md transition-colors 
                        ${isActive ? "bg-neutral-700 text-neutral-50 hover:bg-neutral-800" : "text-neutral-600 hover:bg-neutral-200"}`}>
                            Articles
                        </NavLink>
                        <NavLink to="/analytics" className={({ isActive }) => `block py-3 px-4 rounded-md transition-colors 
                        ${isActive ? "bg-neutral-700 text-neutral-50 hover:bg-neutral-800" : "text-neutral-600 hover:bg-neutral-200"}`}>
                            Analytics
                        </NavLink>
                    </nav>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}