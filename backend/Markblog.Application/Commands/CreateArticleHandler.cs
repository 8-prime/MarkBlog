using Markblog.Application.Interfaces;
using Markblog.Application.Mappings;
using Markblog.Application.Models;
using Markblog.Application.Services;
using MediatR;

namespace Markblog.Application.Commands;

public class CreateArticleHandler : IRequestHandler<CreateArticleCommand, ArticleModel>
{
    private readonly IBlogDbContext _blogDbContext;

    public CreateArticleHandler(IBlogDbContext blogDbContext)
    {
        _blogDbContext = blogDbContext;
    }

    public async Task<ArticleModel> Handle(CreateArticleCommand request, CancellationToken cancellationToken)
    {
        var dbArticle = request.Article.MapToEntity();
        var readDuration = ReadDurationService.GetReadDurationSeconds(request.Article.ArticleText);
        dbArticle.ReadDurationSeconds = readDuration;
        _blogDbContext.Articles.Add(dbArticle);
        await _blogDbContext.SaveChangesAsync(cancellationToken);

        request.Article.ReadDurationSeconds = readDuration;
        request.Article.Id = dbArticle.Id;
        return request.Article;
    }
}