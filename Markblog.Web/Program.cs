using Markblog.Infrastructure.Contexts;
using Markblog.Web.Extensions;
using Markblog.Web.Pages;


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

//app.UseHttpsRedirection();
app.MapDefaultEndpoints();
app.UseStaticFiles();
app.UseSession();
app.UseAntiforgery();

app.MapRazorComponents<App>();

using (var scope = app.Services.CreateScope())
using (var ctx = scope.ServiceProvider.GetRequiredService<ArticleContext>())
{
    ctx.Database.EnsureDeleted();
    ctx.Database.EnsureCreated();
}

app.Run();
