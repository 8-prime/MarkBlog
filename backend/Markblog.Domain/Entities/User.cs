using Microsoft.AspNetCore.Identity;

namespace Markblog.Domain.Entities;

public class User : IdentityUser
{
    public bool IsInitialized  { get; set; }
}