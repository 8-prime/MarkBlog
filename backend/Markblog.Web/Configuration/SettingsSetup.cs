using Markblog.Application.Settings;

namespace Markblog.Web.Configuration;

public static class SettingsSetup
{
    public static IServiceCollection AddSettingsSetup(this IServiceCollection services, IConfiguration configuration)
    {
        return services.Configure<ApplicationSettings>(configuration.GetSection(ApplicationSettings.Settings));
    }
}