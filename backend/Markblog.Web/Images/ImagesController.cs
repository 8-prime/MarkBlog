using Markblog.Infrastructure.Backgroundservices;
using Microsoft.AspNetCore.Mvc;

namespace Markblog.Web.Images;

[ApiController]
[Route("api/images")]
public class ImagesController(IConfiguration configuration) : ControllerBase
{
    [HttpGet]
    [Route("{*image}")]
    public async Task<IActionResult> GetImage(string image)
    {
        var basePath = configuration.GetRequiredSection(FileWatcherService.FileKey).Value;
        var imagePath = Path.Combine(basePath ?? string.Empty, image);
        if(!Path.Exists(imagePath) || System.IO.File.GetAttributes(imagePath).HasFlag(FileAttributes.Directory)){
            return BadRequest();
        }

        byte[] bytes = await System.IO.File.ReadAllBytesAsync(imagePath);
        return File(bytes, $"image/{Path.GetExtension(imagePath)}");
    }

    [HttpGet]
    [Route("demo")]
    public IActionResult Test(){
        return Ok();
    }
}