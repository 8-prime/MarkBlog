namespace Markblog.Infrastructure.Entities
{
    public class ArticleEntity
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string FilePath { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int ReadDurationSeconds { get; set; }
    }
}
