using Microsoft.AspNetCore.Mvc;
using NetApi.Models;

namespace NetApi.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
 
    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<AuthToken>> Login()
    {
        return Ok(await Task.FromResult(new AuthToken()));
    }

    [HttpPost]
    [Route("register")]
    public async Task<ActionResult<AuthToken>> Register()
    {
        return Ok(await Task.FromResult(new AuthToken()));
    }

    [HttpPost]
    [Route("refresh")]
    public async Task<ActionResult<AuthToken>> Refresh()
    {
        return Ok(await Task.FromResult(new AuthToken()));
    }
}
