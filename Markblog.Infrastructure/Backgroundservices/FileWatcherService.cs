using Markblog.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Text;

namespace Markblog.Infrastructure.Backgroundservices
{
    internal enum ChangeType
    {
        Creation,
        Update,
        Deletion
    }

    public class FileWatcherService : BackgroundService
    {
        private const string FileKey = "ArticleFiles";
        private FileSystemWatcher _watcher;
        private readonly IServiceProvider _serviceProvider;

        private const int WordsPerMinute = 183;

        public FileWatcherService(IConfiguration config, IServiceProvider provider)
        {
            _serviceProvider = provider;

            var fileLocation = config.GetRequiredSection(FileKey).Value ?? throw new ArgumentException($"Config key {FileKey} not found. Please specify a valid directory where articles are stored");
            if (!Directory.Exists(fileLocation)) throw new ArgumentException($"{FileKey} is not a valid dictionary");

            _watcher = new FileSystemWatcher(fileLocation);
            _watcher.Created += OnCreated;
            _watcher.Deleted += OnDeleted;
            _watcher.Changed += OnChanged;

            _watcher.EnableRaisingEvents = true;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var logger = scope.ServiceProvider.GetService<ILogger<FileWatcherService>>();
            logger.LogInformation("Starting watcher service");

            //while (!stoppingToken.IsCancellationRequested)
            //{
            //    await Task.Delay(1000);
            //}
        }

        private async void OnChanged(object sender, FileSystemEventArgs e)
        {
            await HandleChanges(e, ChangeType.Update);
        }

        private async void OnCreated(object sender, FileSystemEventArgs e)
        {
            await HandleChanges(e, ChangeType.Creation);
        }

        private async void OnDeleted(object sender, FileSystemEventArgs e)
        {
            await HandleChanges(e, ChangeType.Deletion);
        }


        private async Task HandleChanges(FileSystemEventArgs e, ChangeType type)
        {
            using var scope = _serviceProvider.CreateScope();
            using var context = scope.ServiceProvider.GetRequiredService<ArticleContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<FileWatcherService>>();

            var lines = await File.ReadAllLinesAsync(e.FullPath);

            if (lines.Length < 1) return;

            string? title;

            if (!lines[0].StartsWith('#')) return;

            title = lines[0][1..^1];

            StringBuilder descriptionBuilder = new StringBuilder();

            string? currentLine = null;

            bool buildDescription = true;

            int totalWords = 0;

            char[] delimiters = [' ', '\r', '\n'];

            for (int i = 0; i < lines.Length; i++)
            {
                currentLine = lines[i];
                if (buildDescription && (currentLine.StartsWith("//")))
                {
                    descriptionBuilder.Append(currentLine[1..^1]);
                }
                else
                {
                    buildDescription = false;
                }
                totalWords += currentLine.Split(delimiters, StringSplitOptions.RemoveEmptyEntries).Length;
            }

            int readTimeSeconds = totalWords / WordsPerMinute;



            switch (type)
            {
                case ChangeType.Creation:
                    logger.LogInformation("Update with mode {creation} for {event}", type, e);
                    await context.Articles.AddAsync(new Entities.ArticleEntity
                    {
                        FilePath = e.FullPath,
                        Title = title,
                        CreatedDate = DateTime.UtcNow,
                        Id = Guid.NewGuid(),
                        ReadDurationSeconds = readTimeSeconds,
                        UpdatedDate = DateTime.UtcNow,
                        Description = descriptionBuilder.ToString()

                    });
                    await context.SaveChangesAsync();
                    break;
                case ChangeType.Update:
                    await context.Articles
                        .Where(a => a.FilePath == e.FullPath)
                        .ExecuteUpdateAsync(a => a
                                .SetProperty(u => u.UpdatedDate, DateTime.UtcNow)
                                .SetProperty(u => u.ReadDurationSeconds, readTimeSeconds)
                                .SetProperty(u => u.Description, descriptionBuilder.ToString())
                        );
                    break;
                case ChangeType.Deletion:
                    await context.Articles.Where(a => a.FilePath.Equals(e.FullPath)).ExecuteDeleteAsync();
                    break;
            }
        }
    }
}
