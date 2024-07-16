using Markblog.Infrastructure.Contexts;
using Markblog.Web.Components;
using Markblog.Web.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddRazorComponents();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.MapDefaultEndpoints();

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>();

using (var scope = app.Services.CreateScope())
using (var ctx = scope.ServiceProvider.GetRequiredService<ArticleContext>())
{
    ctx.Database.EnsureDeleted();
    ctx.Database.EnsureCreated();
}

app.Run();
