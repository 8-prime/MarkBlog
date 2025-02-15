using Markblog.Application.Settings;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace Markblog.Application.Services;

public class ImageUploadConfiguartionService : BackgroundService
{
    private readonly ApplicationSettings _settings;

    public ImageUploadConfiguartionService(IOptions<ApplicationSettings> settings)
    {
        _settings = settings.Value;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (_settings.ImageDirectory is null)
        {
            throw new ApplicationException("Must specify an image directory");
        }
        if (!Path.Exists(_settings.ImageDirectory))
        {
            Directory.CreateDirectory(_settings.ImageDirectory);
        }
        return Task.CompletedTask;
    }
}