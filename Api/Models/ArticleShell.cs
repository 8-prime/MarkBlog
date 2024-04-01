namespace NetApi.Models;

public class ArticleShell
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public DateTime CreatedAt { get; set; }
    public required string Author { get; set; }
}