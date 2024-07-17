using Markblog.Infrastructure.Contexts;
using Markblog.Infrastructure.Enums;
using Markblog.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text;

namespace Markblog.Infrastructure.Services
{
    public class UpdateHandlerService(ArticleContext context, ILogger<UpdateHandlerService> logger)
    {
        private const int WordsPerMinute = 183;


        public async Task CheckDirectory(string directory)
        {
            if (!Directory.Exists(directory)) return;
            var files = Directory.GetFiles(directory);
            foreach (var file in files)
            {
                await ComputeChanges(ChangeType.Creation, file);
            }
        }

        public async Task HandleChanges(UpdateModel update)
        {
            await ComputeChanges(update.type, update.e.FullPath);
        }

        private async Task ComputeChanges(ChangeType type, string filePath)
        {
            logger.LogInformation("Parsing new article {filePath}", filePath);
            var lines = await File.ReadAllLinesAsync(filePath);

            if (lines.Length < 1) return;

            string? title;

            if (!lines[0].StartsWith('#')) return;

            title = lines[0][1..^0];

            StringBuilder descriptionBuilder = new StringBuilder();

            string? currentLine = null;

            bool buildDescription = true;

            int totalWords = 0;

            char[] delimiters = [' ', '\r', '\n'];

            for (int i = 1; i < lines.Length; i++)
            {
                currentLine = lines[i];
                if (buildDescription && (currentLine.StartsWith("//")))
                {
                    descriptionBuilder.Append(currentLine[2..^0]);
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
                case ChangeType.Update:
                    var existing = await context.Articles.AsNoTracking().FirstOrDefaultAsync(a => a.FilePath == filePath);
                    bool isnew = existing is null;

                    existing = new Entities.ArticleEntity
                    {
                        Id = existing?.Id ?? Guid.NewGuid(),
                        CreatedDate = existing?.CreatedDate ?? DateTime.UtcNow,
                        UpdatedDate = DateTime.UtcNow,
                        FilePath = filePath,
                        Title = title,
                        Description = descriptionBuilder.ToString(),
                        ReadDurationSeconds = readTimeSeconds,
                    };
                    if (isnew) context.Articles.Add(existing);
                    await context.SaveChangesAsync();
                    break;
                case ChangeType.Deletion:
                    await context.Articles.Where(a => a.FilePath.Equals(filePath)).ExecuteDeleteAsync();
                    break;
            }
        }
    }
}
