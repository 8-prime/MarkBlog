using Markblog.Application;

namespace Markblog.Web.Configuration;

public static class MediatrSetup
{
    public static IServiceCollection AddMediatRSetup(this IServiceCollection services)
    {
        return services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(ApplicationAssemblyPointer).Assembly));
    }
}