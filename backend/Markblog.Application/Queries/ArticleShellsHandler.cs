using Markblog.Application.Interfaces;
using Markblog.Application.Mappings;
using Markblog.Application.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Application.Queries;

public class ArticleShellsHandler : IRequestHandler<ArticleShellsQuery, List<ArticleShell>>
{
    private readonly IBlogDbContext _context;

    public ArticleShellsHandler(IBlogDbContext context)
    {
        _context = context;
    }

    public async Task<List<ArticleShell>> Handle(ArticleShellsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Articles.Select(a => a.MapToShell()).ToListAsync(cancellationToken);
    }
}