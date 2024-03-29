using System.IdentityModel.Tokens.Jwt;

namespace NetApi.Tools;

public class TokenValidator
{
    private readonly JwtSecurityToken _jwt;
    public TokenValidator(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jsonToken = handler.ReadToken(token);
        _jwt = jsonToken as JwtSecurityToken ?? throw new ArgumentException("Token is not valid JWT");
    }


    public static T? GetPayloadValue<T>(string token, string key)
    {
        var handler = new JwtSecurityTokenHandler();
        var jsonToken = handler.ReadToken(token);
        var jwt = jsonToken as JwtSecurityToken ?? throw new ArgumentException("Token is not valid JWT");

        if (jwt.Payload.TryGetValue(key, out var payload))
        {
            return (T)payload;
        }

        return default!;
    }

    public T? GetPayloadVlaue<T>(string key)
    {
        if (_jwt.Payload.TryGetValue(key, out var payload))
        {
            return (T)payload;
        }

        return default!;
    }

}