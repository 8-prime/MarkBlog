using Markblog.Application.Interfaces;
using Markblog.Application.Mappings;
using Markblog.Application.Models;
using MediatR;

namespace Markblog.Application.Commands;

public class CreateArticleHandler : IRequestHandler<CreateArticleCommand, ArticleModel>
{
    private readonly IArticlePageService _articlePageService;
    private readonly IArticleDbContext _articleDbContext;

    public CreateArticleHandler(IArticlePageService articlePageService, IArticleDbContext articleDbContext)
    {
        _articlePageService = articlePageService;
        _articleDbContext = articleDbContext;
    }
    
    public async Task<ArticleModel> Handle(CreateArticleCommand request, CancellationToken cancellationToken)
    {
        var articlePath = await _articlePageService.CreateArticlePage(request.Article);
        var dbArticle = request.Article.MapToEntity(articlePath);
        _articleDbContext.Articles.Add(dbArticle);
        await _articleDbContext.SaveChangesAsync(cancellationToken);
        return dbArticle.MapToModel();
    }
}