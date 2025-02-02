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
        var group = app.MapGroup("articles");
        group.MapPost("/", CreateArticle);
        group.MapPut("/{id:guid}", UpdateArticle);
        group.MapDelete("/{id:guid}", DeleteArticle);
        return app;
    }

    private static async Task<Ok<ArticleModel>> CreateArticle([FromBody] ArticleModel article,
        [FromServices] IMediator mediator)
    {
        var res = await mediator.Send(new CreateArticleCommand(article));
        return TypedResults.Ok(res);
    }

    private static async Task<Results<Ok<ArticleModel>, NotFound>> UpdateArticle(Guid id,
        [FromBody] ArticleModel article,
        [FromServices] IMediator mediator)
    {
        var res = await mediator.Send(new UpdateArticleCommand(article));
        if (res is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(res);
    }

    private static async Task<Results<Ok, NotFound>> DeleteArticle(Guid id, [FromServices] IMediator mediator)
    {
        if (!await mediator.Send(new DeleteArticleCommand(id)))
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok();
    }
}