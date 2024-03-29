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

    public static ArticleModel ArticleModel(Article article)
    {
        Console.WriteLine(article);
        return new ArticleModel
        {
            Id = article.Id,
            CreatedAt = article.CreatedAt.ToString(),
            LastChanged = article.LastChanged.ToString(),
            MarkdownText = article.MarkdownText,
            Tags = article.Tags,
            Title = article.Title,
            UserId = article.UserId,
            UserName = article.User.UserName
        };
    }

    public static Article Article(ArticleModel model)
    {
        return new Article
        {
            Id = model.Id,
            CreatedAt = DateTime.UtcNow,
            LastChanged = DateTime.UtcNow,
            MarkdownText = model.MarkdownText,
            Tags = model.Tags,
            Title = model.Title,
            UserId = model.UserId
        };
    }
    public static Article Article(ArticleModel model, Article entity)
    {
        return new Article
        {
            Id = model.Id,
            CreatedAt = entity.CreatedAt,
            LastChanged = DateTime.UtcNow,
            MarkdownText = model.MarkdownText,
            Tags = model.Tags,
            Title = model.Title,
            UserId = model.UserId
        };
    }
}