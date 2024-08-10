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

            var existing = await context.Articles.FirstOrDefaultAsync(a => a.FilePath == filePath);

            var updateTime = DateTime.UtcNow;



            if (existing is null)
            {
                existing = new Entities.ArticleEntity
                {
                    Id = Guid.NewGuid(),
                    CreatedDate = updateTime,
                    UpdatedDate = updateTime,
                    FilePath = filePath,
                    Title = article.Title,
                    Description = article.Description,
                    Tags = article.Tags,
                    Image = article.Image,
                    ReadDurationSeconds = article.ReadingDurationSeconds,
                };
                context.Articles.Add(existing);
            }
            else
            {
                existing.UpdatedDate = updateTime;
                existing.Title = article.Title;
                existing.Description = article.Description;
                existing.Tags = article.Tags;
                existing.Image = article.Image;
                existing.ReadDurationSeconds = article.ReadingDurationSeconds;
            }
            await context.SaveChangesAsync();
        }
    }
}
