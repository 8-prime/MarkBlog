using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Queries;

public class ArticleShellQuery(Guid ArticleId): IRequest<ArticleShell>;