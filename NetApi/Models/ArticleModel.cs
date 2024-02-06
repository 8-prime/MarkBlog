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
    public string? CreatedAt { get; set; }
    public string? LastChanged { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
}