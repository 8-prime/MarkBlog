using Markblog.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Markblog.Infrastructure.Services;

public class AuthSeedingService(IServiceScopeFactory scopeFactory) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var scope = scopeFactory.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        
        if (await userManager.FindByNameAsync("admin") != null)
        {
            return;
        }

        var user = new User
        {
            UserName = "admin",
            Email = "admin@example.com",
            IsInitialized = false
        };
        var result = await userManager.CreateAsync(user);
        if (!result.Succeeded)
        {
            throw new ApplicationException(string.Join('\n', result.Errors.Select(e => e.Description)));
        }
        
        var changePwResult  = await userManager.AddPasswordAsync(user, "admin");
        if (!changePwResult.Succeeded)
        {
            throw new ApplicationException(string.Join('\n', result.Errors.Select(e => e.Description)));
        }
    }
}