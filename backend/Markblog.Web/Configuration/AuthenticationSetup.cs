using Markblog.Domain.Entities;
using Markblog.Infrastructure.Contexts;
using Markblog.Infrastructure.Services;
using Markblog.Web.Endpoints;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;

namespace Markblog.Web.Configuration;

public static class AuthenticationSetup
{
    public static IServiceCollection AddAuthenticationSetup(this IServiceCollection services)
    {
        services.AddHostedService<AuthSeedingService>();
        services
            .AddAuthorization()
            .AddAuthentication(opts =>
            {
                opts.DefaultAuthenticateScheme = IdentityConstants.BearerScheme;
                opts.DefaultSignInScheme = IdentityConstants.BearerScheme;
                opts.DefaultChallengeScheme = IdentityConstants.BearerScheme;
            })
            .AddBearerToken(IdentityConstants.BearerScheme)
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme);
        services.AddIdentityCore<User>(opts =>
            {
                opts.Password.RequireDigit = false;
                opts.Password.RequireLowercase = false;
                opts.Password.RequireUppercase = false;
                opts.Password.RequireNonAlphanumeric = false;
                opts.Password.RequiredLength = 5;
                opts.Password.RequiredUniqueChars = 0;
            })
            .AddEntityFrameworkStores<AuthDbContext>()
            .AddApiEndpoints();
        return services;
    }

    public static WebApplication MapAuthentication(this WebApplication app)
    {
        // app.MapIdentityApi<User>();
        app.MapAuthEndpoints();
        return app;
    }
}