using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using NetApi.Entities;

namespace NetApi.Models;

public class ArticleModel
{
    public int Id { get; set; }
    public string Title { get; set; }
    public List<string> Tags { get; set; }
    public string MarkdownText { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastChanged { get; set; } = DateTime.UtcNow;
    public int UserId { get; set; }
    public string UserName { get; set; }
}