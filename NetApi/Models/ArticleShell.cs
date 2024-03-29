namespace NetApi.Models;

public class ArticleShell
{
    public int ArticleId { get; set; }
    public required string Title { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public DateTime CreatedAt { get; set; }
    public required string Author { get; set; }
}