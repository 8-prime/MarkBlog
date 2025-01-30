using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Commands;

public record CreateArticleCommand(ArticleModel Article) : IRequest<ArticleModel>;