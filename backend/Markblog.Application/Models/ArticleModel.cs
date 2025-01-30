namespace Markblog.Application.Models
{
    public class ArticleModel
    {
        public required string Title { get; set; }
        public required string ArticleText { get; set; }
        public string? Description { get; set; }
        public string? Tags { get; set; }
        public string? Image { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int ReadDurationSeconds { get; set; }
    }
}
