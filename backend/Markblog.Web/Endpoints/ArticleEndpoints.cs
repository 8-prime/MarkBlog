using Markblog.Application.Commands;
using Markblog.Application.Models;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Markblog.Web.Endpoints;

public static class ArticleEndpoints
{
    public static WebApplication MapArticleEndpoints(this WebApplication app)
    {
        app.MapGroup("articles")
            .MapPost("/articles", CreateArticle);
        return app;
    }

    public static async Task<Ok<ArticleModel>> CreateArticle([FromBody] ArticleModel article, [FromServices] IMediator mediator)
    {
        var res = await mediator.Send(new CreateArticleCommand(article));
        return TypedResults.Ok(res);
    }
    
}