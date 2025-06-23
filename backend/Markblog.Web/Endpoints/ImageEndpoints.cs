using Markblog.Application.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Markblog.Web.Endpoints;

public static class ImageEndpoints
{
    private const string GroupPrefix = "api/images";

    public static WebApplication MapImageEndpoints(this WebApplication app)
    {
        var group = app.MapGroup(GroupPrefix);
        group.MapPost("/", CreateImage).DisableAntiforgery().RequireAuthorization();
        group.MapGet("/{id:guid}", GetImage);
        return app;
    }

    private static async Task<Results<Ok<string>, BadRequest>> CreateImage(IFormFile file,
        [FromServices] ImagesRepository imagesRepository, CancellationToken ct)
    {
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms,ct);
        var imageBytes = ms.ToArray();
        var response = await imagesRepository.SaveImageAsync(imageBytes, ct);

        return TypedResults.Ok(GroupPrefix + "/" + response);
    }

    private static async Task<Results<IResult, NotFound>> GetImage(Guid id, [FromServices] ImagesRepository imagesRepository, CancellationToken ct)
    {
        var res = await imagesRepository.GetImageAsync(id, ct);
        if (res is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.File(res, "image/jpeg");
    }
}