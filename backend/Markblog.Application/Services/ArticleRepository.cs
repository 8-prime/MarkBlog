using Markblog.Application.Constants;
using Markblog.Application.Interfaces;
using Markblog.Application.Mappings;
using Markblog.Application.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Markblog.Application.Services;

public class ArticleRepository
{
    private readonly IBlogDbContext _blogDbContext;
    private readonly IMemoryCache _memoryCache;


    public ArticleRepository(IBlogDbContext blogDbContext, IMemoryCache memoryCache)
    {
        _blogDbContext = blogDbContext;
        _memoryCache = memoryCache;
    }

    public async Task<ArticleModel> CreateArticleAsync(ArticleCreationModel article,
        CancellationToken cancellationToken = default)
    {
        var dbArticle = article.MapToEntity();
        var readDuration = ReadDurationService.GetReadDurationSeconds(article.ArticleText);
        dbArticle.ReadDurationSeconds = readDuration;
        _blogDbContext.Articles.Add(dbArticle);
        await _blogDbContext.SaveChangesAsync(cancellationToken);

        article.ReadDurationSeconds = readDuration;
        return article.MapToModel(dbArticle.Id);
    }

    public async Task<ArticleModel?> UpdateArticleAsync(ArticleModel article,
        CancellationToken cancellationToken = default)
    {
        _memoryCache.Remove(CacheKeys.GetArticleTextCacheKey(article.Id));
        var readDuration = ReadDurationService.GetReadDurationSeconds(article.ArticleText);
        if (await _blogDbContext.Articles.Where(a => a.Id == article.Id)
                .ExecuteUpdateAsync(setters => setters
                        .SetProperty(a => a.Title, article.Title)
                        .SetProperty(a => a.ArticleText, article.ArticleText)
                        .SetProperty(a => a.Description, article.Description)
                        .SetProperty(a => a.Tags, article.Tags)
                        .SetProperty(a => a.Image, article.Image)
                        .SetProperty(a => a.UpdatedDate, DateTime.UtcNow)
                        .SetProperty(a => a.ReadDurationSeconds, readDuration)
                    , cancellationToken) == 0)
        {
            return null;
        }

        article.ReadDurationSeconds = readDuration;
        return article;
    }

    public async Task<bool> DeleteArticleAsync(Guid articleId, CancellationToken cancellationToken = default)
    {
        _memoryCache.Remove(CacheKeys.GetArticleTextCacheKey(articleId));
        return await _blogDbContext.Articles
            .Where(a => a.Id == articleId)
            .ExecuteDeleteAsync(cancellationToken) != 0;
    }

    public async Task<List<ArticleShell>> GetArticleShellsAsync(CancellationToken cancellationToken = default)
    {
        return await _blogDbContext.Articles.Select(a => a.MapToShell()).ToListAsync(cancellationToken);
    }

    public async Task<ArticleModel?> GetArticleModelAsync(Guid articleId, CancellationToken cancellationToken = default)
    {
        var article =
            await _blogDbContext.Articles.FirstOrDefaultAsync(a => a.Id == articleId,
                cancellationToken: cancellationToken);

        return article?.MapToModel();
    }
}