using System.Net;
using BlazorTemplater;
using Markblog.Application.Constants;
using Markblog.Application.Interfaces;
using Markblog.Web.Pages.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Markblog.Application.Mappings;
using Markblog.Application.Queries;
using Markblog.Domain.Entities;
using Markblog.Web.Pages.Home;
using MediatR;
using Microsoft.Extensions.Caching.Memory;

namespace Markblog.Web.Endpoints;

public static class BlogEndpoints
{
    private const int PageSize = 10;

    public static WebApplication MapBlogEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("");
        group.MapGet("/", GetHomePage);
        group.MapGet("/article/{id:guid}", GetArticle);
        group.MapGet("/article-overview/", GetArticleOverview);
        return app;
    }

    private static async Task<IResult> GetArticle(Guid id,
        [FromServices] IMediator mediator, IMemoryCache memoryCache)
    {
        var cacheHit = memoryCache.TryGetValue(CacheKeys.GetArticleTextCacheKey(id), out var articleText);
        if (cacheHit && articleText is string articleTextString)
        {
            return Results.Text(content: articleTextString, "text/plain", statusCode: (int)HttpStatusCode.OK);
        }

        var article = await mediator.Send(new ArticleModelQuery(id));
        if (article is null)
        {
            return TypedResults.NotFound();
        }

        var articleHtml = new ComponentRenderer<ArticlePage>()
            .Set(c => c.Article, article).Render();
        if (articleHtml is null)
        {
            return TypedResults.InternalServerError();
        }

        memoryCache.Set(CacheKeys.GetArticleTextCacheKey(id), articleHtml);
        return Results.Text(content: articleHtml, contentType: "text/html", statusCode: (int)HttpStatusCode.OK);
    }

    private static async Task<IResult> GetHomePage(
        [FromServices] IBlogDbContext dbContext)
    {
        var userinfo = await dbContext.Users.FirstOrDefaultAsync();
        var articles = await GetArticlesForPage(0, dbContext);
        var landingHtml = new ComponentRenderer<Home>()
            .Set(c => c.UserInfoEntity, userinfo)
            .Set(c => c.Articles, articles)
            .Set(c => c.PageSize, PageSize)
            .Render();
        if (landingHtml is null)
        {
            return TypedResults.InternalServerError();
        }

        return Results.Text(content: landingHtml,
            contentType: "text/html",
            statusCode: (int)HttpStatusCode.OK);
    }

    private static async Task<IResult> GetArticleOverview(int page, [FromServices] IBlogDbContext dbContext)
    {
        var articles = await GetArticlesForPage(page, dbContext);

        var overviewHtml = new ComponentRenderer<ArticlesOverview>()
            .Set(c => c.Articles, articles)
            .Set(c => c.Page, page)
            .Set(c => c.PageSize, PageSize)
            .Render();
        return Results.Text(content: overviewHtml,
            contentType: "text/html",
            statusCode: (int)HttpStatusCode.OK);
    }

    private static async Task<List<ArticleEntity>> GetArticlesForPage(int page, IBlogDbContext dbContext)
    {
        return await dbContext.Articles
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedDate)
            .Skip(page * PageSize)
            .Take(PageSize)
            .ToListAsync();
    }
}