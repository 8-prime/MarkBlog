using System.Collections.Generic;
using NetApi.Entities;

namespace NetApi.Models;

public class ArticleModel
{
    public int Id { get; set; }
    public string Title { get; set; }
    public List<string> Tags { get; set; }
    public string MarkdownText { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastChanged { get; set; }
    public int UserId { get; set; }
    public string UserName {get; set;}
}