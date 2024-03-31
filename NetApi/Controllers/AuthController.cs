using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NetApi.Entities;
using NetApi.Models;
using NetApi.Repositories;
using NetApi.Tools;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace NetApi.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserDbRepository _repo;
    private IConfiguration _config;

    public AuthController(UserDbRepository repo, IConfiguration config)
    {
        _repo = repo;
        _config = config;

    }

    private string TokenForUser(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? string.Empty));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var sectoken = new JwtSecurityToken(_config["Jwt:Issuer"],
          _config["Jwt:Issuer"],
          null,
          expires: DateTime.Now.AddMinutes(120),
          signingCredentials: credentials);
        sectoken.Payload["userName"] = user.UserName;
        sectoken.Payload["id"] = user.Id;

        return new JwtSecurityTokenHandler().WriteToken(sectoken);
    }
    private string RefreshToken()
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? string.Empty));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var sectoken = new JwtSecurityToken(
            _config["Jwt:Issuer"],
            _config["Jwt:Issuer"],
            expires: DateTime.Now.AddDays(14),
            signingCredentials: credentials);

        sectoken.Payload["id"] = Guid.NewGuid().ToString();

        return new JwtSecurityTokenHandler().WriteToken(sectoken);
    }

    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<AuthToken>> Login([FromBody] UserModel user)
    {
        var entity = await _repo.GetUserByName(user.UserName);

        if (!PasswordTools.Verify(user.Password, entity?.Password ?? string.Empty))
        {
            return Unauthorized("Wrong user or password or both or neither?! idk");
        }

        var token = TokenForUser(entity!);
        if (token is null) return BadRequest();


        return Ok(new AuthToken
        {
            JWT = token,
            Refresh = RefreshToken()
        });
    }

    [HttpPost]
    [Route("register")]
    public async Task<ActionResult<string>> Register([FromBody] UserModel user)
    {
        var hashed = PasswordTools.HashWithSalt(user.Password);
        var newUser = new User
        {
            Password = hashed,
            UserName = user.UserName
        };
        var res = await _repo.CreateUser(newUser);
        if (res is null)
        {
            return BadRequest("Username already taken");
        }

        var token = TokenForUser(res!);
        if (token is null) return BadRequest();


        return Ok(new AuthToken
        {
            JWT = token,
            Refresh = RefreshToken()
        });
    }

    [HttpPost]
    [Route("refresh")]
    public async Task<ActionResult<AuthToken>> Refresh([FromBody] AuthToken tokens)
    {
        if (tokens.Refresh is null) return BadRequest("Must supply refresh token on refresh request");

        var existingToken = await _repo.GetRefreshTokenAsync(tokens.Refresh);
        if (existingToken is null) return BadRequest("Invalid refresh token Please login again");
        if (existingToken.Expiry < DateTime.UtcNow)
        {
            await _repo.DeleteExpiredToken(existingToken);
            return BadRequest("Invalid refresh token. Please login again");
        }

        var refresh = RefreshToken();

        int? userId = TokenHelper.GetPayloadValue<int>(tokens.JWT, "id");
        if (userId is null) return BadRequest("Invalid JWT");
        var dbUser = await _repo.GetUserById((int)userId);
        if (dbUser is null) return BadRequest("Cant find User for request");

        var token = TokenForUser(dbUser);

        return Ok(new AuthToken
        {
            JWT = token,
            Refresh = refresh
        });
    }
}
