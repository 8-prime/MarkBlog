using Markblog.Application.Interfaces;
using Markblog.Application.Mappings;
using Markblog.Application.Models;
using Markblog.Application.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Application.Commands;

public class UpdateArticleHandler : IRequestHandler<UpdateArticleCommand, ArticleModel>
{
    private readonly IArticlePageService _articlePageService;
    private readonly IArticleDbContext _articleDbContext;

    public UpdateArticleHandler(IArticleDbContext articleDbContext, IArticlePageService articlePageService)
    {
        _articleDbContext = articleDbContext;
        _articlePageService = articlePageService;
    }
    
    public async Task<ArticleModel> Handle(UpdateArticleCommand request, CancellationToken cancellationToken)
    {
        await _articlePageService.UpdateArticlePage(request.Article);
        var readDuration = ReadDurationService.GetReadDurationSeconds(request.Article.ArticleText); 
        
        await _articleDbContext.Articles.Where(a => a.Id == request.Article.Id)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(a => a.Title, request.Article.Title)
                .SetProperty(a => a.ArticleText, request.Article.ArticleText)
                .SetProperty(a => a.Description, request.Article.Description)
                .SetProperty(a => a.Tags, request.Article.Tags)
                .SetProperty(a => a.Image, request.Article.Image)
                .SetProperty(a => a.UpdatedDate, DateTime.UtcNow)
                .SetProperty(a => a.ReadDurationSeconds, readDuration)
            , cancellationToken);
        request.Article.ReadDurationSeconds = readDuration;
        return request.Article;
    }
}