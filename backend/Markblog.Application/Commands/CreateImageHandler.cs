using ImageMagick;
using Markblog.Application.Interfaces;
using Markblog.Application.Settings;
using Markblog.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Options;

namespace Markblog.Application.Commands;

public class CreateImageHandler : IRequestHandler<CreateImageCommand, Guid>
{
    private readonly ApplicationSettings _settings;
    private readonly IBlogDbContext _blogDbContext;

    public CreateImageHandler(IOptions<ApplicationSettings> options, IBlogDbContext blogDbContext)
    {
        _settings = options.Value;
        _blogDbContext = blogDbContext;
    }

    public async Task<Guid> Handle(CreateImageCommand request, CancellationToken cancellationToken)
    {
        var imageId = Guid.NewGuid();
        var imagePath = Path.Join(_settings.ImageDirectory, $"{imageId}.webp");
        using var image = new MagickImage(request.Data);
        image.Format = MagickFormat.WebP;
        await image.WriteAsync(imagePath, cancellationToken);

        _blogDbContext.Images.Add(new ImageEntity
        {
            Id = imageId,
            Path = imagePath,
        });
        await _blogDbContext.SaveChangesAsync(cancellationToken);
        return imageId;
    }
}