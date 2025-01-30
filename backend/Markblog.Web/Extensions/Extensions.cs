using Markblog.Infrastructure.Contexts;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Markblog.Web.Extensions
{
    public static class Extensions
    {
        public static IHostApplicationBuilder AddServiceDefaults(this IHostApplicationBuilder builder)
        {
            builder.Services.AddHealthChecks()
            // Add a default liveness check to ensure app is responsive
            .AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddDbContext<BlogContext>(opts => opts
            .UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));
            return builder;
        }

        public static WebApplication MapDefaultEndpoints(this WebApplication app)
        {
            app.MapControllers();
            app.MapHealthChecks("/health");

            app.MapHealthChecks("/alive", new HealthCheckOptions
            {
                Predicate = r => r.Tags.Contains("live")
            });

            return app;
        }
    }
}
