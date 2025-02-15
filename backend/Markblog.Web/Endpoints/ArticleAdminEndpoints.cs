using Markblog.Application.Commands;
using Markblog.Application.Interfaces;
using Markblog.Application.Mappings;
using Markblog.Application.Models;
using Markblog.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Web.Endpoints;

public static class ArticleAdminEndpoints
{
    public static WebApplication MapArticleAdminEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api/articles-admin").RequireAuthorization();
        group.MapPost("/", CreateArticle);
        group.MapPut("/{id:guid}", UpdateArticle);
        group.MapDelete("/{id:guid}", DeleteArticle);
        group.MapGet("/{id:guid}", GetArticle);
        group.MapGet("/shells", GetArticleShells);
        group.MapGet("/userinfo", GetUserInfo);
        group.MapPost("/userinfo", UpdateUserInfo);
        return app;
    }

    private static async Task<Results<Ok<UserInfoModel>, InternalServerError>> GetUserInfo(
        [FromServices] IMediator mediator)
    {
        var model = await mediator.Send(new UserInfoQuery());
        if (model == null)
        {
            return TypedResults.InternalServerError();
        }

        return TypedResults.Ok(model);
    }

    private static async Task<Results<Ok, InternalServerError>> UpdateUserInfo([FromServices] IMediator mediator,
        [FromBody] UserInfoModel userInfoModel)
    {
        await mediator.Send(new UpdateUserInfoCommand(userInfoModel));
        return TypedResults.Ok();
    }

    private static async Task<Results<Ok<ArticleModel>, NotFound>> GetArticle(Guid id,
        [FromServices] IBlogDbContext dbContext)
    {
        var model = (await dbContext.Articles.FirstOrDefaultAsync(a => a.Id == id))?.MapToModel();
        if (model is null) return TypedResults.NotFound();
        return TypedResults.Ok(model);
    }

    private static async Task<Ok<List<ArticleShell>>> GetArticleShells([FromServices] IBlogDbContext dbContext)
    {
        return TypedResults.Ok(await dbContext.Articles.Select(a => a.MapToShell()).ToListAsync());
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