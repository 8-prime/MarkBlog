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
        private readonly Channel<UpdateModel> updateChannel;


        public FileWatcherService(IConfiguration config, IServiceProvider provider)
        {
            updateChannel = Channel.CreateUnbounded<UpdateModel>();

            _serviceProvider = provider;

            var fileLocation = config.GetRequiredSection(FileKey).Value
                ?? throw new ArgumentException($"Config key {FileKey} not found. Please specify a valid directory where articles are stored");

            if (!Directory.Exists(fileLocation)) throw new ArgumentException($"{FileKey} is not a valid dictionary");

            _watcher = new FileSystemWatcher(fileLocation);
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
                logger?.LogInformation("Starting watcher service");
            }

            while (!stoppingToken.IsCancellationRequested)
            {
                await updateChannel.Reader.WaitToReadAsync(stoppingToken);
                using (var scope = _serviceProvider.CreateScope())
                {
                    var update = await updateChannel.Reader.ReadAsync(stoppingToken);
                    await Console.Out.WriteLineAsync("Writing changes");
                    var handler = scope.ServiceProvider.GetRequiredService<UpdateHandlerService>();
                    await handler.HandleChanges(update);
                }
            }
        }

        private async void OnChanged(object sender, FileSystemEventArgs e)
        {
            await updateChannel.Writer.WriteAsync(new UpdateModel(Enums.ChangeType.Update, e));
        }

        private async void OnCreated(object sender, FileSystemEventArgs e)
        {
            await updateChannel.Writer.WriteAsync(new UpdateModel(Enums.ChangeType.Creation, e));
        }

        private async void OnDeleted(object sender, FileSystemEventArgs e)
        {
            await updateChannel.Writer.WriteAsync(new UpdateModel(Enums.ChangeType.Deletion, e));
        }
    }
}
