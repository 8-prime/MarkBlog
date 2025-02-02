using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Queries;

public record ArticleModelQuery(Guid ArticleId) : IRequest<ArticleModel?>;