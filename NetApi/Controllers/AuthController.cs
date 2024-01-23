using Microsoft.AspNetCore.Mvc;
using NetApi.Entities;
using NetApi.Models;
using NetApi.Repositories;
using NetApi.Tools;
using Microsoft.IdentityModel.Tokens;
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


    private string TokenForUser(User user){
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

    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<AuthToken>> Login([FromBody] UserModel user)
    {
        var entity = await _repo.GetUserByName(user.UserName);

        if(!PasswordTools.Verify(user.Password, entity?.Password ?? string.Empty)){
            return Unauthorized("Wrong user or password or both or neither?! idk");
        }

        return Ok(TokenForUser(entity!));
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
        await _repo.CreateUser(newUser);

        return Ok(TokenForUser(newUser));
    }

    [HttpPost]
    [Route("refresh")]
    public async Task<ActionResult<AuthToken>> Refresh()
    {
        return Ok(await Task.FromResult(new AuthToken()));
    }
}
