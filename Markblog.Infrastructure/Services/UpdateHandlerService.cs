using Markblog.Infrastructure.Contexts;
using Markblog.Infrastructure.Enums;
using Markblog.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Markblog.Infrastructure.Services
{
    public class UpdateHandlerService(ArticleContext context, ILogger<UpdateHandlerService> logger)
    {
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
            if (type == ChangeType.Deletion)
            {
                await context.Articles.Where(a => a.FilePath.Equals(filePath)).ExecuteDeleteAsync();
                return;
            }
            logger.LogInformation("Parsing new article {FilePath}", filePath);

            ArticleModel? article = null;

            int tries = 0;
            while (tries < 5)
            {
                try
                {
                    article = await ArticleFileParser.ParseArticle(filePath);
                    break;
                }
                catch
                {
                    tries++;
                }
            }


            if (article is null) return;

            var existing = await context.Articles.AsNoTracking().FirstOrDefaultAsync(a => a.FilePath == filePath);
            bool isnew = existing is null;

            var updateTime = DateTime.UtcNow;

            existing = new Entities.ArticleEntity
            {
                Id = existing?.Id ?? Guid.NewGuid(),
                CreatedDate = existing?.CreatedDate ?? updateTime,
                UpdatedDate = updateTime,
                FilePath = filePath,
                Title = article.Title,
                Description = article.Description,
                Tags = article.Tags,
                Image = article.Image,
                ReadDurationSeconds = article.ReadingDurationSeconds,
            };
            if (isnew) context.Articles.Add(existing);
            await context.SaveChangesAsync();
        }
    }
}
