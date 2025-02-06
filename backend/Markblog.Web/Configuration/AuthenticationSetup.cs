using Domain.Entities;
using Markblog.Infrastructure.Contexts;
using Microsoft.AspNetCore.Identity;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions.Internal;

namespace Markblog.Web.Configuration;

public static class AuthenticationSetup
{
    public static IServiceCollection AddAuthenticationSetup(this IServiceCollection services)
    {
        services
            .AddAuthorization()
            .AddAuthentication();
        services.AddIdentityCore<User>()
            .AddEntityFrameworkStores<AuthDbContext>()
            .AddApiEndpoints();
        return services;
    }

    public static WebApplication MapAuthentication(this WebApplication app)
    {
        app.MapIdentityApi<User>();
        return app;
    }
}