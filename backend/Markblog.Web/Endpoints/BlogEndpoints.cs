using System.Diagnostics.CodeAnalysis;
using System.Net;
using BlazorTemplater;
using Markblog.Application.Interfaces;
using Markblog.Web.Pages.Components;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Markblog.Application.Mappings;

namespace Markblog.Web.Endpoints;

public static class BlogEndpoints
{
    public static WebApplication MapBlogEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("");
        group.MapGet("/", GetHomePage);
        group.MapGet("/article/{id}", GetArticle);
        return app;
    }

    private static async Task<IResult> GetHomePage(
        [FromServices] IBlogDbContext dbContext)
    {
        var articles = await dbContext.Articles.ToListAsync();
        var landingHtml = new ComponentRenderer<ArticlesOverview>()
            .Set(c => c.Articles, articles)
            .Render();
        if (landingHtml is null)
        {
            return TypedResults.InternalServerError();
        }

        return Results.Text(content: landingHtml,
            contentType: "text/html",
            statusCode: (int)HttpStatusCode.OK);
    }

    private static async Task<IResult> GetArticle(Guid id,
        [FromServices] IBlogDbContext dbContext)
    {
        var article = (await dbContext.Articles.FirstOrDefaultAsync(a => a.Id == id))?.MapToModel();
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

        return Results.Text(content: articleHtml, contentType: "text/html", statusCode: (int)HttpStatusCode.OK);
    }
}