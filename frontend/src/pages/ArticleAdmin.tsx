import { Calendar, Plus, Save, Tag, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { fetchAdminArticle, fetchAdminArticles, updateArticle } from '../api/endpoints';
import Editor from '../components/Editor';

// Your types
type ArticleInfo = {
    id: number;
    title: string;
    description: string;
    updated_at: string;
    published_at: string | null;
    scheduled_at: string | null;
    tags: string[];
};

type CreateArticle = {
    title: string;
    description: string;
    body: string;
    tags: string[];
};

type Article = {
    id: number;
    title: string;
    filename: string;
    description: string;
    body: string;
    created_at: string;
    updated_at: string;
    scheduled_at: string | null;
    published_at: string | null;
    tags: string[];
};

// Union type for the form
type ArticleFormData = CreateArticle | (Article & { isNew?: false });

// Mock data
const mockArticles: ArticleInfo[] = [
    {
        id: 1,
        title: "Getting Started with React",
        description: "A comprehensive guide to React fundamentals",
        updated_at: "2024-01-15T10:30:00Z",
        published_at: "2024-01-10T08:00:00Z",
        scheduled_at: null,
        tags: ["react", "javascript", "tutorial"]
    },
    {
        id: 2,
        title: "TypeScript Best Practices",
        description: "Tips and tricks for writing better TypeScript code",
        updated_at: "2024-01-20T14:15:00Z",
        published_at: null,
        scheduled_at: "2024-01-25T09:00:00Z",
        tags: ["typescript", "best-practices"]
    },
    {
        id: 3,
        title: "State Management in Modern Apps",
        description: "Comparing different state management solutions",
        updated_at: "2024-01-12T16:45:00Z",
        published_at: "2024-01-11T12:00:00Z",
        scheduled_at: null,
        tags: ["state-management", "redux", "zustand"]
    }
];

const mockFullArticles: { [key: number]: Article } = {
    1: {
        ...mockArticles[0],
        filename: "getting-started-react.md",
        body: "This is the full body content of the React article. It covers components, hooks, and state management in detail.",
        created_at: "2024-01-10T07:30:00Z"
    },
    2: {
        ...mockArticles[1],
        filename: "typescript-best-practices.md",
        body: "TypeScript best practices include proper typing, interface usage, and avoiding any types whenever possible.",
        created_at: "2024-01-19T13:00:00Z"
    },
    3: {
        ...mockArticles[2],
        filename: "state-management-modern-apps.md",
        body: "State management is crucial for modern applications. This article compares Redux, Zustand, and Context API.",
        created_at: "2024-01-11T10:15:00Z"
    }
};

const ArticleAdmin = () => {
    const [articles, setArticles] = useState<ArticleInfo[]>(mockArticles);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [formData, setFormData] = useState<ArticleFormData | null>(null);
    const [newTag, setNewTag] = useState('');

    // Initialize form data when selection changes
    useEffect(() => {
        if (isCreatingNew) {
            setFormData({
                title: '',
                description: '',
                body: '',
                tags: []
            });
        } else if (selectedArticle) {
            setFormData({ ...selectedArticle, isNew: false });
        } else {
            setFormData(null);
        }
    }, [selectedArticle, isCreatingNew]);

    useEffect(() => {
        fetchAdminArticles(1).then
            (data => setArticles(data))
            .catch(err => console.error('Error fetching articles:', err));
    }, []);

    const handleArticleSelect = (articleInfo: ArticleInfo) => {
        setIsCreatingNew(false);
        // Mock API call to get full article
        fetchAdminArticle(articleInfo.id).then(fullArticle => {
            setSelectedArticle(fullArticle);
        }).catch(err => console.error('Error fetching article:', err));

    };

    const handleCreateNew = () => {
        setSelectedArticle(null);
        setIsCreatingNew(true);
    };

    const handleInputChange = (field: keyof ArticleFormData, value: string | string[]) => {
        if (!formData) return;
        setFormData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleAddTag = () => {
        if (!formData || !newTag.trim()) return;
        const updatedTags = [...formData.tags, newTag.trim()];
        handleInputChange('tags', updatedTags);
        setNewTag('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        if (!formData) return;
        const updatedTags = formData.tags.filter(tag => tag !== tagToRemove);
        handleInputChange('tags', updatedTags);
    };

    const handleSave = () => {
        if (!formData) return;

        if (isCreatingNew) {
            // Handle creating new article
            const createData: CreateArticle = {
                title: formData.title,
                description: formData.description,
                body: formData.body,
                tags: formData.tags
            };
            console.log('Creating new article:', createData);
            // Mock creation - add to articles list
            const newArticle: ArticleInfo = {
                id: Math.max(...articles.map(a => a.id)) + 1,
                title: createData.title,
                description: createData.description,
                tags: createData.tags,
                updated_at: new Date().toISOString(),
                published_at: null,
                scheduled_at: null
            };
            setArticles(prev => [...prev, newArticle]);
            setIsCreatingNew(false);
        } else {
            if (!selectedArticle) return;
            updateArticle(selectedArticle);

            console.log('Updating article:', formData);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (article: ArticleInfo) => {
        if (article.published_at) {
            return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs ">Published</span>;
        } else if (article.scheduled_at) {
            return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs ">Scheduled</span>;
        } else {
            return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs ">Draft</span>;
        }
    };

    return (
        <div className="flex h-screen bg-background text-text font-family">
            {/* Sidebar */}
            <div className="w-1/5 border-r border-text overflow-y-auto">
                <div className="p-4 border-b border-text">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text">Articles</h2>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 px-3 py-2 bg-primary text-background hover:bg-primary/80 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Article
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-3">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => handleArticleSelect(article)}
                            className={`p-4 bg-background border  ${selectedArticle?.id === article.id ? 'border-primary bg-background/90' : 'border-border-text'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium  truncate">{article.title}</h3>
                                {getStatusBadge(article)}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-secondary mb-2">
                                <Calendar className="w-3 h-3" />
                                Updated {formatDate(article.updated_at)}
                            </div>

                            <p className="text-sm text-text mb-3 line-clamp-2">{article.description}</p>


                            <div className="flex flex-wrap gap-1">
                                {article.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="px-2 py-1 text-xs border border-text">
                                        #{tag}
                                    </span>
                                ))}
                                {article.tags.length > 3 && (
                                    <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {formData ? (
                    <div className=" p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-text">
                                {isCreatingNew ? 'Create New Article' : 'Edit Article'}
                            </h1>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedArticle(null);
                                        setIsCreatingNew(false);
                                        setFormData(null);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 bg-background text-text border border-text hover:bg-primary/80 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2 inline" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-3 py-2 bg-primary text-background hover:bg-primary/80 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    {isCreatingNew ? 'Create Article' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        <div className="h-full space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="w-full px-3 py-2 border-2  border-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter article title..."
                                />
                            </div>

                            <div className='w-full flex flex-row gap-2'>
                                {/* Description */}
                                <div className='grow'>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-text  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter article description..."
                                    />
                                </div>
                                {/* Tags */}
                                <div className='grow'>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        <Tag className="w-4 h-4 inline mr-1" />
                                        Tags
                                    </label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                            className="flex-1 px-3 py-2 border border-text  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Add a tag..."
                                        />
                                        <button
                                            onClick={handleAddTag}
                                            className="flex items-center gap-2 px-3 py-2 bg-primary text-background hover:bg-primary/80 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 px-3 py-1 border border-text text-text  text-sm"
                                            >
                                                #{tag}
                                                <button
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-1 text-primary"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div>
                                <Editor articleText={selectedArticle?.body ?? ''} setArticleText={(text) => setSelectedArticle(prev => prev ? { ...prev, body: text ?? '' } : null)
                                } />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <h3 className="text-lg font-medium mb-2">No Article Selected</h3>
                            <p className="mb-4">Select an article from the sidebar to edit, or create a new one.</p>
                            <button
                                onClick={handleCreateNew}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition-colors mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Create New Article
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default ArticleAdmin;