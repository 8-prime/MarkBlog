using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using NetApi.Contexts;
using NetApi.Factories;
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
                                    .Select(a => ArticleFactory.ArticleShell(a)).ToListAsync();
    }

    public async Task<IReadOnlyCollection<ArticleShell>> GetArticlesForUser(int id){
        return await _context.Articles.Include(a => a.User).Where(a => a.UserId == id)
                                    .Select(a => ArticleFactory.ArticleShell(a)).ToListAsync();
    }

    public async Task<ArticleModel> ArticleModel(int id){
        return await _context.Articles.Where(a => a.Id == id).Select(a => ArticleFactory.ArticleModel(a)).FirstOrDefaultAsync() 
        ?? throw new ArgumentException("Invalid Article Id");
    }

    public async Task<ArticleModel> AddModel(ArticleModel model){
        var entity = ArticleFactory.Article(model);
        _context.Articles.Add(entity);
        await _context.SaveChangesAsync();
        return ArticleFactory.ArticleModel(entity);
    }

    public async Task<ArticleModel?> UpdateModel(ArticleModel model){
        var entity = _context.Articles.FirstOrDefaultAsync(a => a.Id == model.Id);
        if (entity == null) return null;
        var updated = ArticleFactory.Article(model);
        _context.Articles.Update(updated);
        await _context.SaveChangesAsync();
        return ArticleFactory.ArticleModel(updated);
    }
}