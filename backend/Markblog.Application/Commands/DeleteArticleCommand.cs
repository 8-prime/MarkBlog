using MediatR;

namespace Markblog.Application.Commands;

public record DeleteArticleCommand(Guid ArticleId) : IRequest;