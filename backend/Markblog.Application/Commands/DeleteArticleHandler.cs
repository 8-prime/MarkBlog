using Markblog.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Application.Commands;

public class DeleteArticleHandler : IRequestHandler<DeleteArticleCommand>
{
    private readonly IArticlePageService _articlePageService;
    private readonly IArticleDbContext _articleDbContext;

    public DeleteArticleHandler(IArticlePageService articlePageService, IArticleDbContext articleDbContext)
    {
        _articlePageService = articlePageService;
        _articleDbContext = articleDbContext;
    }
    
    public async Task Handle(DeleteArticleCommand request, CancellationToken cancellationToken)
    {
        await _articleDbContext.Articles
            .Where(a => a.Id == request.ArticleId)
            .ExecuteDeleteAsync(cancellationToken);
        await _articlePageService.DeleteArticlePage(request.ArticleId);
    }
}