using Markblog.Application.Commands;
using Markblog.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Markblog.Web.Endpoints;

public static class ImageEndpoints
{
    private const string groupPrefix = "api/images";

    public static WebApplication MapImageEndpoints(this WebApplication app)
    {
        var group = app.MapGroup(groupPrefix);
        group.MapPost("/", CreateImage).DisableAntiforgery();;
        group.MapGet("/{id:guid}", GetImage);
        return app;
    }

    private static async Task<Results<Ok<string>, BadRequest>> CreateImage(IFormFile file,
        [FromServices] IMediator mediator)
    {
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        var imageBytes = ms.ToArray();
        var response = await mediator.Send(new CreateImageCommand(imageBytes));

        return TypedResults.Ok(groupPrefix + "/" + response);
    }

    private static async Task<Results<IResult, NotFound>> GetImage(Guid id, [FromServices] IMediator mediator)
    {
        var res = await mediator.Send(new ImageQuery(id));
        if (res is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.File(res, "image/jpeg");
    }
}