namespace Markblog.Application.Models;

public class UserInfoModel
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
}