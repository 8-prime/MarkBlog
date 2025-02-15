using Markblog.Application.Commands;
using Markblog.Application.Interfaces;
using Markblog.Application.Mappings;
using Markblog.Application.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Application.Queries;

public class UserInfoHandler : IRequestHandler<UserInfoQuery, UserInfoModel?>
{
    private readonly IBlogDbContext _context;

    public UserInfoHandler(IBlogDbContext context)
    {
        _context = context;
    }
    
    public async Task<UserInfoModel?> Handle(UserInfoQuery request, CancellationToken cancellationToken)
    {
        return (await _context.Users.FirstOrDefaultAsync(cancellationToken))?.MapToModel();
    }
}