import { ArrowLeft } from "phosphor-react";
import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router"
import ImageUploader from "../components/ImageUploader";


function Tag({ label, index, onRemove }: { label: string, index: number, onRemove: (index: string) => void }) {
    return (
        <span className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm flex items-center">
            {label}
            <button onClick={() => onRemove(label)} className="ml-2 text-neutral-300 hover:text-neutral-200 rounded-full bg-neutral-600 w-5 h-5">×</button>
        </span>
    );
}

export function ArticleEdit() {
    const navigate = useNavigate();

    const [tags, setTags] = useState<string[]>(["Machine learning", "Ai"]);
    const removeItem = (tag: string) => {
        setTags(tags.filter(t => t != tag))
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <header className="border-b border-neutral-200 pb-6 mb-8">
                <div className="flex justify-start items-center">
                    <NavLink to="/" className="flex justify-start items-center h-full">
                        <ArrowLeft size={30} />
                    </NavLink>
                    <h1 className="flex-grow text-3xl font-light tracking-tight">Edit Article</h1>
                    <div className="space-x-4">
                        <button onClick={() => navigate(-1)} className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-md">Cancel</button>
                        <button className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700">Save</button>
                    </div>
                </div>
            </header>

            <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-neutral-700 mb-2">Title</label>
                    <input
                        id="title"
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        value="Machine Learning Fundamentals"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-neutral-700 mb-2">Description</label>
                    <textarea
                        id="description"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                    >A comprehensive introduction to machine learning concepts and techniques for beginners.</textarea>
                </div>

                <div>
                    <ImageUploader />
                </div>

                <div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((t, i) => {
                            return <Tag key={t} label={t} index={i} onRemove={removeItem} />
                        })}
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
            </div>
        </div>
    );
}