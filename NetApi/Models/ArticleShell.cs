using System.Collections.Generic;
using NetApi.Entities;

namespace NetApi.Models;

public class ArticleShell
{
    public int ArticleId {get; set;}
    public string Title {get; set;}
    public List<string> Tags {get; set;}
    public DateTime CreatedAt {get; set;}
    public string Author {get; set;}
}