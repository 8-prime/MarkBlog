namespace Markblog.Web.Models;

public class PasswordChangeRequest
{
    public required string User { get; init; }

    public required string ResetCode { get; init; }

    public required string NewPassword { get; init; }
}