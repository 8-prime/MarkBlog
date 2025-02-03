using Markblog.Application.Interfaces;
using Markblog.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Web.Configuration;

public static class DatabaseSetup
{
    public static IHostApplicationBuilder SetupDatabase(this IHostApplicationBuilder builder)
    {
        builder.Services.AddDbContext<IBlogDbContext, BlogContext>(opts => opts
            .UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));
        return builder;
    }
}