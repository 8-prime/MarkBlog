using BlazorTemplater;
using Domain.Entities;
using Markblog.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Infrastructure.Contexts
{
    public class BlogContext(DbContextOptions<BlogContext> opts) : DbContext(opts), IBlogDbContext
    {
        public DbSet<ArticleEntity> Articles { get; set; }
        public DbSet<ImageEntity> Images { get; set; }
        public DbSet<UserInfoEntity> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseAsyncSeeding(async (context, _, cancellationToken) =>
                {
                    var userInfo = await context.Set<UserInfoEntity>().FirstOrDefaultAsync(cancellationToken);
                    if(userInfo != null) return;
                        
                    context.Set<UserInfoEntity>().Add(new UserInfoEntity
                    {
                        Id = Guid.NewGuid(),
                    });
                    await context.SaveChangesAsync(cancellationToken);
                });
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.HasDefaultSchema("blogs");
        }
    }
}
