using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Queries;

public record ArticleShellsQuery : IRequest<List<ArticleShell>>;