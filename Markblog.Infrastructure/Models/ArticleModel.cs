namespace Markblog.Infrastructure.Models
{
    internal class ArticleModel
    {
        public required string FilePath { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? Tags { get; set; }
        public string? Image { get; set; }
        public int ReadingDurationSeconds { get; set; }
    }
}
