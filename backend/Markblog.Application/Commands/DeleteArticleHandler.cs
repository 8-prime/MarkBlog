using Markblog.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Application.Commands;

public class DeleteArticleHandler : IRequestHandler<DeleteArticleCommand, bool>
{
    private readonly IBlogDbContext _blogDbContext;

    public DeleteArticleHandler(IBlogDbContext blogDbContext)
    {
        _blogDbContext = blogDbContext;
    }

    public async Task<bool> Handle(DeleteArticleCommand request, CancellationToken cancellationToken)
    {
        return await _blogDbContext.Articles
            .Where(a => a.Id == request.ArticleId)
            .ExecuteDeleteAsync(cancellationToken) != 0;
    }
}