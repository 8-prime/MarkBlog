using Microsoft.AspNetCore.Mvc;

namespace Markblog.Web.Endpoints;

public static class GoogleDeveloperEndpoints
{
    public static WebApplication MapGoogleDeveloperEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("google").RequireAuthorization();
        group.MapPost("", PostGoogleOwnerCertificate);
        return app;
    }

    private static async Task<IResult> PostGoogleOwnerCertificate(IFormFile file,
        [FromServices] IWebHostEnvironment hostingEnvironment)
    {
        var filePath = Path.Join(hostingEnvironment.WebRootPath, file.FileName);
        var webrootFile = File.Create(filePath);
        await file.OpenReadStream().CopyToAsync(webrootFile);
        await using var stream = file.OpenReadStream();

        return Results.Ok();
    }
}