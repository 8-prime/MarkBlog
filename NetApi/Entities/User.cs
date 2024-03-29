namespace NetApi.Entities;


public class User
{
    public int Id { get; set; }

    public required string UserName { get; set; }
    public required string Password { get; set; }
    public List<Article> Articles { get; set; } = new List<Article>();
}