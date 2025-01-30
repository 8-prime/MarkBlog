using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Commands;

public class UpdateArticleHandler : IRequestHandler<UpdateArticleCommand, ArticleModel>
{
    public Task<ArticleModel> Handle(UpdateArticleCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}