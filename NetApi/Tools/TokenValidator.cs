using System.IdentityModel.Tokens.Jwt;
using System.Net.NetworkInformation;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace NetApi.Tools;

public class TokenValidator
{


    private readonly IConfiguration _configuration;

    public TokenValidator(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public bool ValidateToken(string token, out JwtSecurityToken jwt)
    {
        var jwtIssuer = _configuration.GetSection("Jwt:Issuer").Get<string>();
        var jwtKey = _configuration.GetSection("Jwt:Key").Get<string>();

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey ?? string.Empty))
        };

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
            jwt = (JwtSecurityToken)validatedToken;

            return true;
        }
        catch (SecurityTokenValidationException)
        {
            jwt = null!;
            return false;
        }
    }

}