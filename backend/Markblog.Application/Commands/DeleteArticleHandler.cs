using MediatR;

namespace Markblog.Application.Commands;

public class DeleteArticleHandler : IRequestHandler<DeleteArticleCommand>
{
    public Task Handle(DeleteArticleCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}