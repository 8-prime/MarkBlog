using System.Net.Mime;
using ImageMagick;
using Markblog.Application.Interfaces;
using Markblog.Application.Settings;
using Markblog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Markblog.Application.Services;

public class ImagesRepository
{
    private readonly ApplicationSettings _settings;
    private readonly IBlogDbContext _blogDbContext;

    public ImagesRepository(IOptions<ApplicationSettings> options, IBlogDbContext blogDbContext)
    {
        _settings = options.Value;
        _blogDbContext = blogDbContext;
    }

    public async Task<Guid> SaveImageAsync(byte[] imageData, CancellationToken cancellationToken = default)
    {
        var imageId = Guid.NewGuid();
        var imagePath = Path.Join(_settings.ImageDirectory, $"{imageId}.webp");
        using var image = new MagickImage(imageData);
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
    
    public async Task<byte[]?> GetImageAsync(Guid requestedImage, CancellationToken cancellationToken = default)
    {
        var imagePath = await _blogDbContext.Images.Where(i => i.Id == requestedImage).Select(i => i.Path)
            .FirstOrDefaultAsync(cancellationToken);
        if (!Path.Exists(imagePath))
        {
            return null;
        }

        return await File.ReadAllBytesAsync(imagePath, cancellationToken);
    }
}