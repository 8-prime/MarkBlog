using Markblog.Infrastructure.Contexts;
using Markblog.Web.Extensions;
using Markblog.Web.Pages;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddRazorComponents();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".blazorcrud";
    options.IdleTimeout = TimeSpan.FromMinutes(1);
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.MapDefaultEndpoints();
app.UseStaticFiles();
app.UseSession();
app.UseAntiforgery();

app.MapRazorComponents<App>();

using (var scope = app.Services.CreateScope())
using (var ctx = scope.ServiceProvider.GetRequiredService<BlogContext>())
{
    await ctx.Database.MigrateAsync();
}

await app.RunAsync();
