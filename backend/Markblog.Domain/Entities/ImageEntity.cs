namespace Markblog.Domain.Entities;

public class ImageEntity
{
    public Guid Id { get; set; }    
    public required string Path { get; set; }
}