import { Calendar, Plus, Save, Tag, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { fetchAdminArticle, fetchAdminArticles } from '../api/endpoints';

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
            // Handle updating existing article
            console.log('Updating article:', formData);
            // Mock update
            setArticles(prev => prev.map(a =>
                a.id === (formData as Article).id
                    ? { ...a, title: formData.title, description: formData.description, tags: formData.tags }
                    : a
            ));
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
            return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>;
        } else if (article.scheduled_at) {
            return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Scheduled</span>;
        } else {
            return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Draft</span>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Articles</h2>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                            className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${selectedArticle?.id === article.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium text-gray-900 truncate">{article.title}</h3>
                                {getStatusBadge(article)}
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.description}</p>

                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <Calendar className="w-3 h-3" />
                                Updated {formatDate(article.updated_at)}
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {article.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                        {tag}
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
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isCreatingNew ? 'Create New Article' : 'Edit Article'}
                            </h1>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedArticle(null);
                                        setIsCreatingNew(false);
                                        setFormData(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2 inline" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    {isCreatingNew ? 'Create Article' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter article title..."
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter article description..."
                                />
                            </div>

                            {/* Body */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content
                                </label>
                                <textarea
                                    value={formData.body}
                                    onChange={(e) => handleInputChange('body', e.target.value)}
                                    rows={12}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Write your article content here..."
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="w-4 h-4 inline mr-1" />
                                    Tags
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add a tag..."
                                    />
                                    <button
                                        onClick={handleAddTag}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Metadata (only for existing articles) */}
                            {!isCreatingNew && selectedArticle && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-3">Article Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">ID:</span>
                                            <span className="ml-2 text-gray-600">{selectedArticle.id}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Filename:</span>
                                            <span className="ml-2 text-gray-600 font-mono text-xs">{selectedArticle.filename}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Created:</span>
                                            <span className="ml-2 text-gray-600">{formatDate(selectedArticle.created_at)}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Last Updated:</span>
                                            <span className="ml-2 text-gray-600">{formatDate(selectedArticle.updated_at)}</span>
                                        </div>
                                        <div className="md:col-span-2">
                                            <span className="font-medium text-gray-700">Status:</span>
                                            <span className="ml-2">
                                                {selectedArticle.published_at ? (
                                                    <span className="text-green-600">Published {formatDate(selectedArticle.published_at)}</span>
                                                ) : selectedArticle.scheduled_at ? (
                                                    <span className="text-yellow-600">Scheduled {formatDate(selectedArticle.scheduled_at)}</span>
                                                ) : (
                                                    <span className="text-gray-600">Draft</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <h3 className="text-lg font-medium mb-2">No Article Selected</h3>
                            <p className="mb-4">Select an article from the sidebar to edit, or create a new one.</p>
                            <button
                                onClick={handleCreateNew}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Create New Article
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleAdmin;