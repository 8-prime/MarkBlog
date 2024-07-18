using Markblog.Infrastructure.Models;
using System.Text;

namespace Markblog.Infrastructure.Services
{
    public static class ArticleFileParser
    {
        private const int WordsPerSecond = 3;


        public static async Task<ArticleModel?> ParseArticle(string filePath)
        {
            if (!filePath.EndsWith(".md")) return null;
            if (!Path.Exists(filePath)) return null;

            var data = new Dictionary<string, StringBuilder>();
            string? currentSection = null;

            using var reader = new StreamReader(filePath);
            string? line;

            int words = 0;

            while ((line = await reader.ReadLineAsync()) != null)
            {
                line = line.Trim();

                if (line.StartsWith('[') && line.EndsWith(']'))
                {
                    currentSection = line[1..^1];
                }
                else if (currentSection is not null)
                {
                    if (currentSection == "Article")
                    {
                        words += line.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
                    }
                    else if (data.TryGetValue(currentSection, out var sb))
                    {
                        sb.Append('\n');
                        sb.Append(line);
                    }
                    else
                    {
                        data.Add(currentSection, new StringBuilder(line));
                    }
                }
            }

            if (!data.ContainsKey(nameof(ArticleModel.Title))) return null;

            return new ArticleModel
            {
                FilePath = filePath,
                Description = GetSectionSafely(nameof(ArticleModel.Description), data),
                Image = GetSectionSafely(nameof(ArticleModel.Image), data),
                ReadingDurationSeconds = words / 3,
                Tags = GetSectionSafely(nameof(ArticleModel.Tags), data),
                Title = GetSectionSafely(nameof(ArticleModel.Title), data)!,
            };
        }

        public static async Task<string?> ParseArticleText(string filePath)
        {
            if (!filePath.EndsWith(".md")) return null;
            if (!Path.Exists(filePath)) return null;

            var builder = new StringBuilder();
            string? currentSection = null;

            using var reader = new StreamReader(filePath);
            string? line;

            while ((line = await reader.ReadLineAsync()) != null)
            {
                line = line.Trim();

                if (line.StartsWith('[') && line.EndsWith(']'))
                {
                    currentSection = line[1..^1];
                }
                else if (currentSection?.Equals("Article") ?? false)
                {
                    builder.AppendLine(line);
                }
            }

            return builder.ToString();
        }

        private static string? GetSectionSafely(string SectionName, Dictionary<string, StringBuilder> data)
        {
            if (data.TryGetValue(SectionName, out var sb))
            {
                return sb.ToString();
            }
            return null;
        }
    }
}
