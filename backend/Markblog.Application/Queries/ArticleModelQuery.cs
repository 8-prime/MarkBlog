using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Queries;

public class ArticleModelQuery(Guid ArticleId) : IRequest<ArticleModel>;