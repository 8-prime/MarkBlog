namespace NetApi.Models;

public class AuthToken
{
    public string JWT {get; set;} = null!;
    public string Refresh {get; set;} = null!;
}