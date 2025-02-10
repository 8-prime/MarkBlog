using Domain.Entities;
using Markblog.Application.Models;

namespace Markblog.Application.Mappings;

public static class ArticleModelArticleEntityMapping
{
    public static ArticleEntity MapToEntity(this ArticleModel model)
    {
        return new ArticleEntity
        {
            Id = model.Id ?? Guid.NewGuid(),
            Title = model.Title,
            Tags = model.Tags,
            Description = model.Description,
            ArticleText = model.ArticleText,
            Image = model.Image,
            CreatedDate = model.CreatedDate ?? DateTime.UtcNow,
            UpdatedDate = model.UpdatedDate ?? DateTime.UtcNow,
            ReadDurationSeconds = model.ReadDurationSeconds
        };
    }

    public static ArticleModel MapToModel(this ArticleEntity entity)
    {
        return new ArticleModel
        {
            Id = entity.Id,
            Title = entity.Title,
            Tags = entity.Tags,
            Description = entity.Description,
            ArticleText = entity.ArticleText,
            Image = entity.Image,
            CreatedDate = entity.CreatedDate,
            UpdatedDate = entity.UpdatedDate,
            ReadDurationSeconds = entity.ReadDurationSeconds
        };
    }
}