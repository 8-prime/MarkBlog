using Markblog.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Web.Configuration;

public static class DatabaseSetup
{
    public static void SetupDatabase(this IHostApplicationBuilder builder)
    {
        builder.Services.AddDbContext<BlogContext>(opts => opts
            .UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));
    }
}