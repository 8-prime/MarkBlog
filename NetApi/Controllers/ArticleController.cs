using Microsoft.AspNetCore.Authorization;
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

    public ArticleController(ArticleDbRepository repo, TokenValidator tokenValidator)
    {
        _repo = repo;
        _validator = tokenValidator;
    }

    [HttpGet]
    [Route("shells")]
    public async Task<ActionResult<ArticleShell>> GetArticleShells([FromQuery] string? searchTerm)
    {
        return Ok(await _repo.ArticleShells(searchTerm ?? string.Empty));
    }

    [HttpGet]
    [Route("shells/{userId}")]
    public async Task<ActionResult<ArticleShell>> GetArticlesForUser(int userId)
    {
        return Ok(await _repo.GetArticlesForUser(userId));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<ArticleModel>> GetArticle(int id)
    {
        return Ok(await _repo.ArticleModel(id));
    }

    [HttpPost]
    [Authorize]
    [Route("create")]
    public async Task<ActionResult<ArticleModel>> CreateArticle([FromBody] ArticleModel article)
    {
        var authHeader = Request.Headers.Authorization.FirstOrDefault();


        article.UserId = TokenValidator.GetPayloadValue<int>(authHeader!.Replace("Bearer ", ""), "id");
        article = await _repo.AddModel(article);

        return Ok(article);
    }

    [HttpPut]
    [Authorize]
    [Route("update")]
    public async Task<ActionResult<int>> UpdateArticle([FromBody] ArticleModel article)
    {
        var authHeader = Request.Headers.Authorization.FirstOrDefault();

        var userId = TokenValidator.GetPayloadValue<int>(authHeader!.Replace("Bearer ", ""), "id");

        if (article.UserId != userId)
        {
            return Unauthorized("Can only edit your own articles");
        }

        return Ok(await _repo.UpdateModel(article));
    }

    [HttpDelete]
    [Authorize]
    [Route("delete/{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _repo.RemoveArticle(id);
        return Ok();
    }
}
