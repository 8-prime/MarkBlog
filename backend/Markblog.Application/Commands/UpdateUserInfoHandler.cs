using Markblog.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Application.Commands;

public class UpdateUserInfoHandler : IRequestHandler<UpdateUserInfoCommand>
{
    private readonly IBlogDbContext _context;

    public UpdateUserInfoHandler(IBlogDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateUserInfoCommand request, CancellationToken cancellationToken)
    {
        await _context.Users.Where(a => a.Id == request.UserInfoModel.Id)
            .ExecuteUpdateAsync(setters => setters
                    .SetProperty(a => a.Name, request.UserInfoModel.Name)
                    .SetProperty(a => a.Description, request.UserInfoModel.Description)
                    .SetProperty(a => a.ImageUrl, request.UserInfoModel.ImageUrl)
                , cancellationToken);
    }
}