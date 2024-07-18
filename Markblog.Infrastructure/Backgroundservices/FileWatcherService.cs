using Markblog.Infrastructure.Models;
using Markblog.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading.Channels;

namespace Markblog.Infrastructure.Backgroundservices
{
    public class FileWatcherService : BackgroundService
    {
        private const string FileKey = "ArticleFiles";

        private FileSystemWatcher _watcher;
        private readonly IServiceProvider _serviceProvider;
        private readonly Channel<UpdateModel> _updateChannel;
        private readonly string _articleLocation;

        public FileWatcherService(IConfiguration config, IServiceProvider provider)
        {
            _updateChannel = Channel.CreateUnbounded<UpdateModel>();

            _serviceProvider = provider;

            _articleLocation = config.GetRequiredSection(FileKey).Value
                ?? throw new ArgumentException($"Config key {FileKey} not found. Please specify a valid directory where articles are stored");

            if (!Directory.Exists(_articleLocation)) throw new ArgumentException($"{FileKey} is not a valid dictionary");

            _watcher = new FileSystemWatcher(_articleLocation);
            _watcher.Created += OnCreated;
            _watcher.Deleted += OnDeleted;
            _watcher.Changed += OnChanged;

            _watcher.EnableRaisingEvents = true;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var logger = scope.ServiceProvider.GetService<ILogger<FileWatcherService>>();
                var updateHandler = scope.ServiceProvider.GetRequiredService<UpdateHandlerService>();
                logger?.LogInformation("Starting watcher service");
                await updateHandler.CheckDirectory(_articleLocation);
            }

            while (!stoppingToken.IsCancellationRequested)
            {
                await _updateChannel.Reader.WaitToReadAsync(stoppingToken);
                using var scope = _serviceProvider.CreateScope();
                var update = await _updateChannel.Reader.ReadAsync(stoppingToken);
                var handler = scope.ServiceProvider.GetRequiredService<UpdateHandlerService>();
                await handler.HandleChanges(update);
            }
        }

        private async void OnChanged(object sender, FileSystemEventArgs e)
        {
            await _updateChannel.Writer.WriteAsync(new UpdateModel(Enums.ChangeType.Update, e));
        }

        private async void OnCreated(object sender, FileSystemEventArgs e)
        {
            await _updateChannel.Writer.WriteAsync(new UpdateModel(Enums.ChangeType.Creation, e));
        }

        private async void OnDeleted(object sender, FileSystemEventArgs e)
        {
            await _updateChannel.Writer.WriteAsync(new UpdateModel(Enums.ChangeType.Deletion, e));
        }
    }
}
