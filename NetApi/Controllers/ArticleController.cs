using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using NetApi.Models;
using NetApi.Repositories;
using NetApi.Tools;

namespace NetApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ArticleController : ControllerBase
{
    private readonly ArticleDbRepository _repo;
    private readonly TokenValidator _validator;

    public ArticleController(ArticleDbRepository repo, TokenValidator tokenValidator){
        _repo = repo;
        _validator = tokenValidator;
    }

    [HttpGet]
    [Route("shells")]
    public async Task<ActionResult<ArticleShell>> GetArticleShells([FromQuery]string? searchTerm)
    {
        return Ok(await _repo.ArticleShells(searchTerm ?? string.Empty));
    }

    [HttpGet]
    [Route("shells/{userId}")]
    public async Task<ActionResult<ArticleShell>> GetArticlesForUser(int userId){
        return Ok(await _repo.GetArticlesForUser(userId));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<ArticleModel>> GetArticle(int id)
    {
        return Ok(await _repo.ArticleModel(id));
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult<ArticleModel>> CreateArticle([FromBody] ArticleModel article)
    {
        var authHeader = Request.Headers.Authorization.FirstOrDefault();
        JwtSecurityToken token;

        if(authHeader is null || !_validator.ValidateToken(authHeader.Replace("Bearer ", ""), out token)){
            return Unauthorized("Not logged in");
        }

        article.UserId = int.Parse(token.Payload["id"].ToString() ?? "0");
        article = await _repo.AddModel(article);

        return Ok(article);
    }

    [HttpPut]
    [Route("update")]
    public async Task<ActionResult<int>> UpdateArticle([FromBody] ArticleModel article)
    {
        var authHeader = Request.Headers.Authorization.FirstOrDefault();
        JwtSecurityToken token;
        if(!_validator.ValidateToken(authHeader ?? string.Empty, out token)){
            return Unauthorized("Not logged in");
        }

        var userId = int.Parse(token.Payload["id"].ToString() ?? "0");

        if(article.UserId != userId){
            return Unauthorized("Can only edit your own articles");
        }

        return Ok(await _repo.UpdateModel(article));
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        return Ok(await Task.FromResult(() => {}));
    }
}
