namespace Markblog.Web.Models;

public class PasswordResetInformation
{
    public required string ResetToken{ get; set; }
    public required string User{ get; set; }
}