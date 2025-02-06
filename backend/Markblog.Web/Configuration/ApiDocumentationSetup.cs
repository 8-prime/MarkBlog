using Scalar.AspNetCore;

namespace Markblog.Web.Configuration;

public static class ApiDocumentationSetup
{
    public static IServiceCollection AddApiDocumentation(this IServiceCollection services)
    {
        return services.AddOpenApi();
    }

    public static WebApplication MapApiDocumentation(this WebApplication app)
    {
        app.MapOpenApi();
        app.MapScalarApiReference(options =>
        {
            options
                .WithTitle("Markblog API")
                .WithDownloadButton(true)
                .WithTheme(ScalarTheme.Kepler)
                .WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Axios);
        });
        return app;
    }
}