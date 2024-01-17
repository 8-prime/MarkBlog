using Microsoft.AspNetCore.Mvc;
using NetApi.Models;

namespace NetApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ArticleController : ControllerBase
{
    [HttpGet]
    [Route("shells")]
    public async Task<ActionResult<ArticleShell>> GetArticleShells()
    {
        return Ok(await Task.FromResult(new ArticleShell()));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<ArticleShell>> GetArticle(int id)
    {
        return Ok(await Task.FromResult(new ArticleShell()));
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult<int>> CreateArticle([FromBody] ArticleModel article)
    {
        return Ok(await Task.FromResult(1));
    }

    [HttpPut]
    [Route("update")]
    public async Task<ActionResult<int>> UpdateArticle([FromBody] ArticleModel article)
    {
        return Ok(await Task.FromResult(new ArticleShell()));
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        return Ok(await Task.FromResult(() => {}));
    }
}
