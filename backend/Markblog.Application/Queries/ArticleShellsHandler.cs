using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Queries;

public class ArticleShellsHandler : IRequestHandler<ArticleShellsQuery, List<ArticleShell>>
{
    public Task<List<ArticleShell>> Handle(ArticleShellsQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}