using Domain.Entities;
using Markblog.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Infrastructure.Contexts
{
    public class BlogContext(DbContextOptions<BlogContext> opts) : DbContext(opts), IBlogDbContext
    {
        public DbSet<ArticleEntity> Articles { get; set; }
        public DbSet<ImageEntity> Images { get; set; }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.HasDefaultSchema("blogs");
        }
    }
}
