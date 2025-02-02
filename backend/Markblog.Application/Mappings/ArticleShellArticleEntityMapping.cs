using Domain.Entities;
using Markblog.Application.Models;

namespace Markblog.Application.Mappings;

public static class ArticleShellArticleEntityMapping
{
    public static ArticleShell MaptToShell(this ArticleEntity entity)
    {
        return new ArticleShell
        {
            Title = entity.Title,
            CreatedDate = entity.CreatedDate,
            UpdatedDate = entity.UpdatedDate,
        };
    }
}