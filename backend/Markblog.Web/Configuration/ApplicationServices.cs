using Markblog.Application.Services;

namespace Markblog.Web.Configuration;

public static class ApplicationServices
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        return services
            .AddScoped<ArticleRepository>()
            .AddScoped<ImagesRepository>()
            .AddScoped<UserRepository>();        
    }
}