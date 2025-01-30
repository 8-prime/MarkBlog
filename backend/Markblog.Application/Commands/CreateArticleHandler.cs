using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Commands;

public class CreateArticleHandler : IRequestHandler<CreateArticleCommand, ArticleModel>
{
    public Task<ArticleModel> Handle(CreateArticleCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}