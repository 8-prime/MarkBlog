using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Queries;

public class ArticleModelHandler : IRequestHandler<ArticleModelQuery, ArticleModel>
{
    public Task<ArticleModel> Handle(ArticleModelQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}