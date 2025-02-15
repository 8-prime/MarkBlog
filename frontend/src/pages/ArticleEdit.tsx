import { ArrowLeft } from "phosphor-react";
import { useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import ImageUploader from "../components/ImageUploader";
import { useBlogStore } from "../state/Store";
import { uploadImage } from "../api/api";
import { BasicButton } from "../components/BasicButton";


function Tag({ label, index, onRemove }: { label: string, index: number, onRemove: (index: string) => void }) {
    return (
        <span className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm flex items-center">
            {label}
            <button onClick={() => onRemove(label)} className="ml-2 text-neutral-300 hover:text-neutral-200 rounded-full bg-neutral-600 w-5 h-5">×</button>
        </span>
    );
}

export function ArticleEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const selectedArticle = useBlogStore((store) => store.currentArticle)
    const updateLocal = useBlogStore((store) => store.updateLocal)
    const fetchArticle = useBlogStore((store) => store.fetchArticle)
    const updateArticle = useBlogStore((store) => store.updateArticle)
    const createArticle = useBlogStore((store) => store.createArticle)

    const handleTextChanged = (newContent: string) => {
        if (!selectedArticle) return;
        updateLocal({
            ...selectedArticle,
            articleText: newContent,
        })
    }
    const handleDescriptionChanged = (newContent: string) => {
        if (!selectedArticle) return;
        updateLocal({
            ...selectedArticle,
            description: newContent
        })
    }

    const handleTitleChanged = (newContent: string) => {
        if (!selectedArticle) return;
        updateLocal({
            ...selectedArticle,
            title: newContent
        })
    }

    const handleSave = () => {
        if (!selectedArticle) return;
        if (selectedArticle.id) {
            updateArticle(selectedArticle);
            return;
        }
        createArticle(selectedArticle);
    }

    useEffect(() => {
        if (id) {
            fetchArticle(id)
        } else {
            updateLocal({
                id: undefined,
                title: '',
                articleText: '',
                description: '',
                tags: '',
                image: '',
                createdDate: undefined,
                updatedDate: undefined,
                readDurationSeconds: 0
            });
        }
    }, [])

    useEffect(() => {
        if (selectedArticle?.id && !id) {
            window.history.replaceState(null, "New Page Title", `/edit/${selectedArticle.id}`)
        }
    }, [selectedArticle])


    const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {

        if (e.clipboardData.files.length) {
            const fileObject = e.clipboardData.files[0];
            if (fileObject) {
                const response = await uploadImage(fileObject);
                if (response && selectedArticle) {
                    const imageInfo = `![](${response})`
                    updateLocal({
                        ...selectedArticle,
                        articleText: selectedArticle?.articleText + `\n${imageInfo}\n`
                    })
                }
            }
        } else {
            alert('No image data was found in your clipboard. Copy an image first or take a screenshot.');
        }
    };

    const handleImageUpdate = (imageUrl: string) => {
        updateLocal({
            ...selectedArticle!,
            image: imageUrl
        })
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <header className="border-b border-neutral-200 pb-6 mb-8">
                <div className="flex justify-start items-center">
                    <NavLink to="/" className="flex justify-start items-center h-full">
                        <ArrowLeft size={30} />
                    </NavLink>
                    {id == undefined &&
                        <h1 className="flex-grow text-3xl font-light tracking-tight">Save new Article</h1>
                    }
                    {id != undefined &&
                        <h1 className="flex-grow text-3xl font-light tracking-tight">Edit Article</h1>
                    }
                    <div className="space-x-4">
                        <button onClick={() => navigate(-1)} className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-md">Cancel</button>
                        <BasicButton onClick={handleSave}>Save</BasicButton>
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
                        value={selectedArticle?.title ?? ''}
                        onChange={(e) => handleTitleChanged(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-neutral-700 mb-2">Description</label>
                    <textarea
                        id="description"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        value={selectedArticle?.description ?? ''}
                        onChange={(e) => handleDescriptionChanged(e.target.value)}
                    />
                </div>

                <div>
                    {
                        selectedArticle?.image &&
                        <img src={'/' + selectedArticle?.image} alt="Article title" />
                    }
                    <ImageUploader onSelected={handleImageUpdate} />
                </div>
                <div>
                    <label htmlFor="articleText" className="block text-neutral-700 mb-2">Content (Markdown)</label>
                    <textarea
                        id="articleText"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md min-h-[400px] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        placeholder="Write your article in Markdown..."
                        value={selectedArticle?.articleText ?? ''}
                        onPaste={(e) => handlePaste(e)}
                        onChange={(e) => handleTextChanged(e.target.value)}
                    >
                    </textarea>
                </div>
            </div>
        </div>
    );
}