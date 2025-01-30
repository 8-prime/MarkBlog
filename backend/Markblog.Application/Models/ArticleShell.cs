namespace Markblog.Application.Models;

public class ArticleShell
{
    public required string Title { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
}