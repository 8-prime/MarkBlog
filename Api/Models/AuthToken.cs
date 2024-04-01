namespace NetApi.Models;

public class AuthToken
{
    public required string JWT { get; set; }
    public string? Refresh { get; set; }
}