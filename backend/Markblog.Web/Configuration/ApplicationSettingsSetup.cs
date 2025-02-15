using Markblog.Application.Services;
using Microsoft.AspNetCore.Server.Kestrel.Core.Features;

namespace Markblog.Web.Configuration;

public static class ApplicationSettingsSetup
{
    public static IServiceCollection AddApplicationSettings(this IServiceCollection services)
    {
        return services.AddHostedService<ImageUploadConfiguartionService>();
    }
}