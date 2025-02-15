using System.Text;
using Domain.Entities;
using Markblog.Web.Models;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using LoginRequest = Markblog.Web.Models.LoginRequest;

namespace Markblog.Web.Endpoints;

public static class AuthEndpoints
{
    public static WebApplication MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api");
        group.MapPost("/login", Login);
        group.MapPost("/change-password", ChangePassword);
        group.MapPost("/refresh", Refresh);
        group.MapGet("/check", Check).RequireAuthorization();
        
        return app;
    }

    private static Results<Ok, UnauthorizedHttpResult> Check()
    {
        return TypedResults.Ok();
    }
    
    private static async
        Task<Results<Ok<PasswordResetInformation>, EmptyHttpResult, ProblemHttpResult, UnauthorizedHttpResult>> Login(
            [FromBody] LoginRequest loginRequest,
            [FromServices] UserManager<User> userManager,
            [FromServices] SignInManager<User> signInManager)
    {
        if (await userManager.FindByNameAsync(loginRequest.Username) is not { } user ||
            string.IsNullOrEmpty(user.UserName))
        {
            return TypedResults.Problem();
        }

        signInManager.AuthenticationScheme = IdentityConstants.BearerScheme;

        if (user.IsInitialized)
        {
            var result = await signInManager.PasswordSignInAsync(user.UserName, loginRequest.Password, false,
                lockoutOnFailure: true);
            if (!result.Succeeded)
            {
                return TypedResults.Problem(result.ToString(), statusCode: StatusCodes.Status401Unauthorized);
            }

            //Logging in already attaches the body to the response
            return TypedResults.Empty;
        }

        var validPassword = await userManager.CheckPasswordAsync(user, loginRequest.Password);
        if (!validPassword)
        {
            return TypedResults.Unauthorized();
        }

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        return TypedResults.Ok(new PasswordResetInformation { ResetToken = token, User = loginRequest.Username });
    }

    private static async Task<Results<Ok, ValidationProblem, EmptyHttpResult>>
        ChangePassword([FromBody] PasswordChangeRequest request, [FromServices] UserManager<User> userManager)
    {
        var user = await userManager.FindByNameAsync(request.User);
        if (user is null)
        {
            // Don't reveal that the user does not exist or is not confirmed, so don't return a 200 if we had
            // returned a 400 for an invalid code given a valid user email.
            return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.InvalidToken()));
        }

        IdentityResult result;
        try
        {
            result = await userManager.ResetPasswordAsync(user, request.ResetCode, request.NewPassword);
        }
        catch (FormatException)
        {
            result = IdentityResult.Failed(userManager.ErrorDescriber.InvalidToken());
        }

        if (!result.Succeeded)
        {
            return CreateValidationProblem(result);
        }

        user.IsInitialized = true;
        await userManager.UpdateAsync(user);
        
        return TypedResults.Empty;
    }

    private static async
        Task<Results<Ok<AccessTokenResponse>, UnauthorizedHttpResult, SignInHttpResult, ChallengeHttpResult>> Refresh
        ([FromBody] RefreshRequest refreshRequest, [FromServices] SignInManager<User> signInManager,
            [FromServices] IOptionsMonitor<BearerTokenOptions> bearerTokenOptions,
            [FromServices] TimeProvider timeProvider)
    {
        //TODO get refresh token from cookies instead
        var refreshTokenProtector = bearerTokenOptions.Get(IdentityConstants.BearerScheme).RefreshTokenProtector;
        var refreshTicket = refreshTokenProtector.Unprotect(refreshRequest.RefreshToken);

        // Reject the /refresh attempt with a 401 if the token expired or the security stamp validation fails
        if (refreshTicket?.Properties?.ExpiresUtc is not { } expiresUtc ||
            timeProvider.GetUtcNow() >= expiresUtc ||
            await signInManager.ValidateSecurityStampAsync(refreshTicket.Principal) is not { } user)

        {
            return TypedResults.Challenge();
        }

        var newPrincipal = await signInManager.CreateUserPrincipalAsync(user);
        return TypedResults.SignIn(newPrincipal, authenticationScheme: IdentityConstants.BearerScheme);
    }

    private static ValidationProblem CreateValidationProblem(IdentityResult result)
    {
        // We expect a single error code and description in the normal case.
        // This could be golfed with GroupBy and ToDictionary, but perf! :P
        var errorDictionary = new Dictionary<string, string[]>(1);

        foreach (var error in result.Errors)
        {
            string[] newDescriptions;

            if (errorDictionary.TryGetValue(error.Code, out var descriptions))
            {
                newDescriptions = new string[descriptions.Length + 1];
                Array.Copy(descriptions, newDescriptions, descriptions.Length);
                newDescriptions[descriptions.Length] = error.Description;
            }
            else
            {
                newDescriptions = [error.Description];
            }

            errorDictionary[error.Code] = newDescriptions;
        }

        return TypedResults.ValidationProblem(errorDictionary);
    }
}