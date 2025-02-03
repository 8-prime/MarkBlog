import { ArrowLeft } from "phosphor-react";
import { NavLink, useParams } from "react-router"

export function ArticleEdit() {
    let { id } = useParams();
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <header className="border-b border-neutral-200 pb-6 mb-8">
                <div className="flex justify-start items-center">
                    <NavLink to="/" className="flex justify-start items-center h-full">
                        <ArrowLeft size={30} />
                    </NavLink>
                    <h1 className="flex-grow text-3xl font-light tracking-tight">Edit Article</h1>
                    <div className="space-x-4">
                        <button className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-md">Cancel</button>
                        <button className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700">Save</button>
                    </div>
                </div>
            </header>

            <form className="space-y-6">
                <div>
                    <label className="block text-neutral-700 mb-2">Title</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        value="Machine Learning Fundamentals"
                    />
                </div>

                <div>
                    <label className="block text-neutral-700 mb-2">Description</label>
                    <textarea
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                    >A comprehensive introduction to machine learning concepts and techniques for beginners.</textarea>
                </div>

                <div>
                    <label className="block text-neutral-700 mb-2">Cover Image</label>
                    <div className="flex items-center space-x-4">
                        <div className="w-32 h-24 bg-neutral-200 rounded-md flex items-center justify-center text-neutral-500">
                            No Image
                        </div>
                        <button className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-100">
                            Upload Image
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-neutral-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm flex items-center">
                            Machine Learning
                            <button className="ml-2 text-neutral-500 hover:text-neutral-700">×</button>
                        </span>
                        <span className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm flex items-center">
                            AI
                            <button className="ml-2 text-neutral-500 hover:text-neutral-700">×</button>
                        </span>
                        <input
                            type="text"
                            placeholder="Add tag"
                            className="px-3 py-1 border border-neutral-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-neutral-700 mb-2">Content (Markdown)</label>
                    <textarea
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md min-h-[400px] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        placeholder="Write your article in Markdown..."
                    ># Machine Learning Fundamentals

                        Machine learning is a subset of artificial intelligence that focuses on the use of data and algorithms to imitate the way that humans learn.

                        ## Key Concepts

                        - Supervised Learning: Learning with labeled training data
                        - Unsupervised Learning: Finding patterns in unlabeled data
                        - Reinforcement Learning: Learning through interaction with an
                        environment
                    </textarea>
                </div>
            </form>
        </div>
    );
}