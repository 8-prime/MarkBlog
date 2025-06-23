using Markblog.Application.Interfaces;
using Markblog.Application.Mappings;
using Markblog.Application.Models;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Application.Services;

public class UserRepository
{
    private readonly IBlogDbContext _context;

    public UserRepository(IBlogDbContext context)
    {
        _context = context;
    }

    public async Task UpdateUserDataAsync(UserInfoModel userInfo, CancellationToken cancellationToken = default)
    {
        await _context.Users.Where(a => a.Id == userInfo.Id)
            .ExecuteUpdateAsync(setters => setters
                    .SetProperty(a => a.Name, userInfo.Name)
                    .SetProperty(a => a.Description, userInfo.Description)
                    .SetProperty(a => a.ImageUrl, userInfo.ImageUrl)
                , cancellationToken);
    }
    
    public async Task<UserInfoModel?> GetUserInfoModel(CancellationToken cancellationToken = default)
    {
        return (await _context.Users.FirstOrDefaultAsync(cancellationToken))?.MapToModel();
    }
}