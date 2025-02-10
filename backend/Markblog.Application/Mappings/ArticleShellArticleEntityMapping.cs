using Domain.Entities;
using Markblog.Application.Models;

namespace Markblog.Application.Mappings;

public static class ArticleShellArticleEntityMapping
{
    public static ArticleShell MapToShell(this ArticleEntity entity)
    {
        return new ArticleShell
        {
            Id = entity.Id,
            Title = entity.Title,
            CreatedDate = entity.CreatedDate,
            UpdatedDate = entity.UpdatedDate,
        };
    }
}