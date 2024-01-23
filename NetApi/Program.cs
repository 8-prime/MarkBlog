using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using NetApi.Contexts;
using System.Text;
using NetApi.Tools;

var builder = WebApplication.CreateBuilder(args);

// var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
// var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<string>();

// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//  .AddJwtBearer(options =>
//  {
//      options.TokenValidationParameters = new TokenValidationParameters
//      {
//          ValidateIssuer = true,
//          ValidateAudience = true,
//          ValidateLifetime = true,
//          ValidateIssuerSigningKey = true,
//          ValidIssuer = jwtIssuer,
//          ValidAudience = jwtIssuer,
//          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey ?? string.Empty))
//      };
// });

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<TokenValidator>();
builder.Services.AddDbContext<BlogContext>(opts => opts.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// app.UseAuthentication();
// app.UseAuthorization();

app.MapControllers();

app.Run();
