using Markblog.Infrastructure.Enums;

namespace Markblog.Infrastructure.Models
{
    public record UpdateModel(ChangeType type, FileSystemEventArgs e);
}
