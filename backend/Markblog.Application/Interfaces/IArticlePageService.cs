using Markblog.Application.Models;

namespace Markblog.Application.Interfaces;

public interface IArticlePageService
{
    public Task<string> CreateArticlePage(ArticleModel article);
    public Task UpdateArticlePage(ArticleModel article);
}
