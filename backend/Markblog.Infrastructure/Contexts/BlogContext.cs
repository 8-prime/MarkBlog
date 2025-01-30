using Markblog.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Infrastructure.Contexts
{
    public class BlogContext(DbContextOptions opts) : DbContext(opts)
    {
        public DbSet<ArticleEntity> Articles { get; set; }
        public DbSet<ImageEntity> Images { get; set; }
    }
}
