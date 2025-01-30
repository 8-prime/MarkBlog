using Domain.Entities;
using Markblog.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Infrastructure.Contexts
{
    public class BlogContext(DbContextOptions opts) : DbContext(opts), IArticleDbContext
    {
        public DbSet<ArticleEntity> Articles { get; set; }
        public DbSet<ImageEntity> Images { get; set; }
    }
}
