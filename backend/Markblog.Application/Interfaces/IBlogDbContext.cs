using Markblog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Markblog.Application.Interfaces;

public interface IBlogDbContext
{
    public DbSet<ArticleEntity> Articles { get; set; }
    public DbSet<ImageEntity> Images { get; set; }
    public DbSet<UserInfoEntity> Users { get; set; }
    
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}