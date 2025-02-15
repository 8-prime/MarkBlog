using Markblog.Infrastructure.Contexts;
using Markblog.Web.Configuration;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.SetupDatabase();

builder.Services
    .AddApplicationSettings()
    .AddApiDocumentation()
    .AddMediatRSetup()
    .AddHealthChecksSetup()
    .AddCacheSetup()
    .AddAuthenticationSetup()
    .AddAntiforgery()
    .AddSettingsSetup(builder.Configuration);
var app = builder.Build();

app
    .MapHealthEndpoints()
    .MapApi()
    .MapAuthentication()
    .MapStaticAssets();

app.MapApiDocumentation();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseAntiforgery();

using (var scope = app.Services.CreateScope())
await using (var ctx = scope.ServiceProvider.GetRequiredService<BlogContext>())
await using (var identityContext = scope.ServiceProvider.GetRequiredService<AuthDbContext>())
{
    await ctx.Database.MigrateAsync();
    await identityContext.Database.MigrateAsync();
}

await app.RunAsync();