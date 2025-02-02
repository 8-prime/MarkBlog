using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Commands;

public record UpdateArticleCommand(ArticleModel Article) : IRequest<ArticleModel?>;