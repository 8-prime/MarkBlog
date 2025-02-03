using Markblog.Infrastructure.Contexts;
using Markblog.Web.Configuration;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.SetupDatabase();
builder.Services
    .AddMediatRSetup()
    .AddHealthChecksSetup()
    .AddCacheSetup()
    .AddApplicationServices()
    .AddAntiforgery();
var app = builder.Build();

app
.MapHealthEndpoints()
.MapApi()
.MapStaticAssets();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseAntiforgery();

using (var scope = app.Services.CreateScope())
await using (var ctx = scope.ServiceProvider.GetRequiredService<BlogContext>())
{
    await ctx.Database.MigrateAsync();
}

await app.RunAsync();