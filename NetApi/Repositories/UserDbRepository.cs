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

    public async Task<User?> CreateUser(User newUser)
    {
        if (_context.Users.Any(u => u.UserName == newUser.UserName))
        {
            return null;
        }

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();
        return newUser;
    }

    public async Task<User?> GetUserById(int id)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
    }
    public async Task<User?> GetUserByName(string name)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.UserName == name);
    }
}