using NetApi.Contexts;
using NetApi.Extensions;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.AddServiceDefaults();
builder.AddJwtConfiguration();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
using (var context = scope.ServiceProvider.GetRequiredService<BlogContext>())
{
    context.Database.EnsureCreated();
}

app.UseCors();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapDefaultEndpoints();
app.MapControllers();


app.Run();
