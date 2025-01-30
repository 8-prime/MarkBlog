using Markblog.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Infrastructure.Contexts
{
    public class ArticleContext(DbContextOptions opts) : DbContext(opts)
    {
        public DbSet<ArticleEntity> Articles { get; set; }
    }
}
