using Microsoft.EntityFrameworkCore;
using NetApi.Entities;

namespace NetApi.Contexts
{
    public class BlogContext : DbContext
    {
        public DbSet<Article> Articles { get; set; }
        public DbSet<User> Users { get; set; }

        public BlogContext(DbContextOptions opts): base(opts){

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) => modelBuilder.UseIdentityByDefaultColumns();
    }
}
