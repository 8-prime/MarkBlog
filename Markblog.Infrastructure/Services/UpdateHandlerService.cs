using Markblog.Infrastructure.Backgroundservices;
using Markblog.Infrastructure.Contexts;
using Markblog.Infrastructure.Enums;
using Markblog.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Text;

namespace Markblog.Infrastructure.Services
{
    public class UpdateHandlerService(IServiceProvider serviceProvider)
    {
        private const int WordsPerMinute = 183;

        public async Task HandleChanges(UpdateModel update)
        {
            using var scope = serviceProvider.CreateScope();
            using var context = scope.ServiceProvider.GetRequiredService<ArticleContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<FileWatcherService>>();

            var lines = await File.ReadAllLinesAsync(update.e.FullPath);

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



            switch (update.type)
            {
                case ChangeType.Creation:
                    logger.LogInformation("Update with mode {creation} for {event}", update.type, update.e);
                    await context.Articles.AddAsync(new Entities.ArticleEntity
                    {
                        FilePath = update.e.FullPath,
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
                    var existing = await context.Articles.AsNoTracking().FirstOrDefaultAsync(a => a.FilePath == update.e.FullPath);
                    bool isnew = existing is null;

                    existing = new Entities.ArticleEntity
                    {
                        FilePath = update.e.FullPath,
                        Title = title,
                        CreatedDate = existing?.CreatedDate ?? DateTime.UtcNow,
                        Id = existing?.Id ?? Guid.NewGuid(),
                        ReadDurationSeconds = readTimeSeconds,
                        UpdatedDate = DateTime.UtcNow,
                        Description = descriptionBuilder.ToString()

                    };
                    if (isnew) context.Articles.Add(existing);
                    await context.SaveChangesAsync();
                    break;
                case ChangeType.Deletion:
                    await context.Articles.Where(a => a.FilePath.Equals(update.e.FullPath)).ExecuteDeleteAsync();
                    break;
            }
        }
    }
}
