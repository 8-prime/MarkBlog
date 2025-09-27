function ArticleEdit() {
    return (
        <div>
            <h1>Edit Article</h1>
            <label htmlFor="title">Title</label>
            <input type="text" />
            <label htmlFor="description">Description</label>
            <input type="text" />
            <ArticleEdit />
        </div>
    )
}

export default ArticleEdit;