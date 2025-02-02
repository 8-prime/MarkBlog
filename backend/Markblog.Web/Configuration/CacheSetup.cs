namespace Markblog.Web.Configuration;

public static class CacheSetup
{
    public static IServiceCollection AddCacheSetup(this IServiceCollection services)
    {
        return services.AddMemoryCache();
    }
}