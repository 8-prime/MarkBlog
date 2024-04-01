namespace NetApi.Models;

public class ArticleModel
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public List<string> Tags { get; set; }
    public required string MarkdownText { get; set; }
    public string? CreatedAt { get; set; }
    public string? LastChanged { get; set; }
    public int UserId { get; set; }
    public required string UserName { get; set; }
}