using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using NetApi.Contexts;
using NetApi.Models;
using NetApi.Tools;

namespace NetApi.Repositories;

public class ArticleDbRepository
{
    private readonly BlogContext _context;


    public ArticleDbRepository(BlogContext context)
    {
        _context = context;
    }


    public async Task<IReadOnlyCollection<ArticleShell>> ArticleShells(string search = "")
    {
        return await _context.Articles.Include(a => a.User).Where(a => StringCompare.Cnc(a.Title, search)
                                                                        || a.Tags.Any(t => StringCompare.Cnc(t, search)))
                                    .Select(a => new ArticleShell
                                    {
                                        ArticleId = a.Id,
                                        Author = a.User.UserName,
                                        CreatedAt = a.CreatedAt,
                                        Tags = a.Tags,
                                        Title = a.Title
                                    }).ToListAsync();
    }

    public async Task<ArticleModel> ArticleModel(int id){
        return await _context.Articles.Where(a => a.Id == id).Select(a => new ArticleModel{
            Id = a.Id,
            Title = a.Title,
            Tags = a.Tags,
            MarkdownText = a.MarkdownText,
            CreatedAt = a.CreatedAt,
            LastChanged = a.LastChanged,
            UserId = a.UserId,
            UserName = a.User.UserName
        }).FirstOrDefaultAsync() ?? throw new ArgumentException("Invalid Article Id");
    }

    
}