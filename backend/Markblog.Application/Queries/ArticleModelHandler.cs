using Markblog.Application.Interfaces;
using Markblog.Application.Mappings;
using Markblog.Application.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Application.Queries;

public class ArticleModelHandler : IRequestHandler<ArticleModelQuery, ArticleModel?>
{
    private readonly IBlogDbContext _context;

    public ArticleModelHandler(IBlogDbContext context)
    {
        _context = context;
    }

    public async Task<ArticleModel?> Handle(ArticleModelQuery request, CancellationToken cancellationToken)
    {
        var article =
            await _context.Articles.FirstOrDefaultAsync(a => a.Id == request.ArticleId,
                cancellationToken: cancellationToken);

        return article?.MapToModel();
    }
}