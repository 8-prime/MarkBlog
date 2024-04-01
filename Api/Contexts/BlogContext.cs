using Microsoft.EntityFrameworkCore;
using NetApi.Entities;

namespace NetApi.Contexts
{
    public class BlogContext(DbContextOptions opts) : DbContext(opts)
    {
        public DbSet<Article> Articles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseIdentityByDefaultColumns();
            modelBuilder.Entity<User>().HasIndex(p => p.UserName).IsUnique();
        }
    }
}
