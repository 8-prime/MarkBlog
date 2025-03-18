using Markblog.Application.Constants;
using Markblog.Application.Interfaces;
using Markblog.Application.Mappings;
using Markblog.Application.Models;
using Markblog.Application.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Markblog.Application.Commands;

public class UpdateArticleHandler : IRequestHandler<UpdateArticleCommand, ArticleModel?>
{
    private readonly IBlogDbContext _blogDbContext;
    private readonly IMemoryCache _memoryCache;

    public UpdateArticleHandler(IBlogDbContext blogDbContext, IMemoryCache memoryCache)
    {
        _blogDbContext = blogDbContext;
        _memoryCache = memoryCache;
    }

    public async Task<ArticleModel?> Handle(UpdateArticleCommand request, CancellationToken cancellationToken)
    {
        if (request.Article.Id is not { } articleId)
        {
            return null;
        }
        _memoryCache.Remove(CacheKeys.GetArticleTextCacheKey(articleId));
        var readDuration = ReadDurationService.GetReadDurationSeconds(request.Article.ArticleText);
        if (await _blogDbContext.Articles.Where(a => a.Id == request.Article.Id)
                .ExecuteUpdateAsync(setters => setters
                        .SetProperty(a => a.Title, request.Article.Title)
                        .SetProperty(a => a.ArticleText, request.Article.ArticleText)
                        .SetProperty(a => a.Description, request.Article.Description)
                        .SetProperty(a => a.Tags, request.Article.Tags)
                        .SetProperty(a => a.Image, request.Article.Image)
                        .SetProperty(a => a.UpdatedDate, DateTime.UtcNow)
                        .SetProperty(a => a.ReadDurationSeconds, readDuration)
                    , cancellationToken) == 0)
        {
            return null;
        }

        request.Article.ReadDurationSeconds = readDuration;
        return request.Article;
    }
}