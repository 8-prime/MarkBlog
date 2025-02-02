using Markblog.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Application.Queries;

public class ImageHandler : IRequestHandler<ImageQuery, byte[]?>
{
    private readonly IBlogDbContext _context;

    public ImageHandler(IBlogDbContext context)
    {
        _context = context;
    }

    public async Task<byte[]?> Handle(ImageQuery request, CancellationToken cancellationToken)
    {
        var imagePath = await _context.Images.Where(i => i.Id == request.Id).Select(i => i.Path)
            .FirstOrDefaultAsync(cancellationToken);
        if (!Path.Exists(imagePath))
        {
            return null;
        }

        return await File.ReadAllBytesAsync(imagePath, cancellationToken);
    }
}