using Microsoft.EntityFrameworkCore;
using NetApi.Contexts;
using NetApi.Entities;

namespace NetApi.Repositories;

public class UserDbRepository
{
    private readonly BlogContext _context;

    public UserDbRepository(BlogContext context)
    {
        _context = context;
    }

    public async Task<int> CreateUser(User newUser)
    {
        if (_context.Users.Any(u => u.UserName == newUser.UserName))
        {
            return 0;
        }

        _context.Users.Add(newUser);
        return await _context.SaveChangesAsync(); ;
    }

    public async Task<User?> GetUserById(int id)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
    }
    public async Task<User?> GetUserByName(string name)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.UserName == name);
    }

    public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
    {
        return await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == token);
    }

    public async Task DeleteExpiredToken(RefreshToken token)
    {
        _context.Remove(token);
        await _context.SaveChangesAsync();
    }
}