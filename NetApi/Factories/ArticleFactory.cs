using Microsoft.OpenApi.Services;
using NetApi.Entities;
using NetApi.Models;

namespace NetApi.Factories;

public static class ArticleFactory
{

    public static ArticleShell ArticleShell(Article article)
    {
        return new ArticleShell
        {
            ArticleId = article.Id,
            Author = article.User.UserName,
            CreatedAt = article.CreatedAt,
            Tags = article.Tags,
            Title = article.Title
        };
    }

    public static ArticleModel ArticleModel(Article article){
        return new ArticleModel
        {
            Id = article.Id,
            CreatedAt = article.CreatedAt,
            LastChanged = article.LastChanged,
            MarkdownText = article.MarkdownText,
            Tags = article.Tags,
            Title = article.Title,
            UserId = article.UserId,
            UserName = article.User.UserName
        };
    }

    public static Article Article(ArticleModel model){
        return new Article
        {
            Id = model.Id,
            CreatedAt = model.CreatedAt,
            LastChanged = model.LastChanged,
            MarkdownText = model.MarkdownText,
            Tags = model.Tags,
            Title = model.Title,
            UserId = model.UserId
        };
    }
}