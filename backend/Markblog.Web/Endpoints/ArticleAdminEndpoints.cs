using Markblog.Application.Interfaces;
using Markblog.Application.Mappings;
using Markblog.Application.Models;
using Markblog.Application.Services;
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
        [FromServices] UserRepository userRepository, CancellationToken ct)
    {
        var model = await userRepository.GetUserInfoModel(ct);
        if (model == null)
        {
            return TypedResults.InternalServerError();
        }

        return TypedResults.Ok(model);
    }

    private static async Task<Results<Ok, InternalServerError>> UpdateUserInfo(
        [FromServices] UserRepository userRepository,
        [FromBody] UserInfoModel userInfoModel, CancellationToken ct)
    {
        await userRepository.UpdateUserDataAsync(userInfoModel, ct);
        return TypedResults.Ok();
    }

    private static async Task<Results<Ok<ArticleModel>, NotFound>> GetArticle(Guid id,
        [FromServices] ArticleRepository articleRepository, CancellationToken ct)
    {
        var model = await articleRepository.GetArticleModelAsync(id, ct);
        if (model is null) return TypedResults.NotFound();
        return TypedResults.Ok(model);
    }

    private static async Task<Ok<List<ArticleShell>>> GetArticleShells([FromServices] IBlogDbContext dbContext)
    {
        return TypedResults.Ok(await dbContext.Articles.Select(a => a.MapToShell()).ToListAsync());
    }

    private static async Task<Ok<ArticleModel>> CreateArticle([FromBody] ArticleCreationModel article,
        [FromServices] ArticleRepository articleRepository, CancellationToken ct)
    {
        var model = await articleRepository.CreateArticleAsync(article, ct);
        return TypedResults.Ok(model);
    }

    private static async Task<Results<Ok<ArticleModel>, NotFound>> UpdateArticle(Guid id,
        [FromBody] ArticleModel article,
        [FromServices] ArticleRepository articleRepository, CancellationToken ct)
    {
        var update = await articleRepository.UpdateArticleAsync(article, ct);
        if (update is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(update);
    }

    private static async Task<Results<Ok, NotFound>> DeleteArticle(Guid id, [FromServices] ArticleRepository articleRepository, CancellationToken ct)
    {
        if (!await articleRepository.DeleteArticleAsync(id, ct))
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok();
    }
}