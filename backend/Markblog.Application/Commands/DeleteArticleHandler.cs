using Markblog.Application.Constants;
using Markblog.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Markblog.Application.Commands;

public class DeleteArticleHandler : IRequestHandler<DeleteArticleCommand, bool>
{
    private readonly IBlogDbContext _blogDbContext;
    private readonly IMemoryCache _memoryCache;

    public DeleteArticleHandler(IBlogDbContext blogDbContext,IMemoryCache memoryCache)
    {
        _blogDbContext = blogDbContext;
        _memoryCache = memoryCache;
    }

    public async Task<bool> Handle(DeleteArticleCommand request, CancellationToken cancellationToken)
    {
        _memoryCache.Remove(CacheKeys.GetArticleTextCacheKey(request.ArticleId));
        return await _blogDbContext.Articles
            .Where(a => a.Id == request.ArticleId)
            .ExecuteDeleteAsync(cancellationToken) != 0;
    }
}