using Markblog.Application.HtmlRendering;
using Markdig;
using Markdig.Renderers;
using Markdig.Renderers.Html;
using Markdig.Syntax;

namespace Markblog.Application.Services;

public class MarkdownRenderService
{
    // private readonly HtmlRenderer _renderer;
    // private readonly MarkdownPipeline _pipeline;
    //
    // public MarkdownRenderService()
    // {
    //     _pipeline = new MarkdownPipelineBuilder()
    //         .UseCustomContainers()
    //         .UseAdvancedExtensions().Build();
    //     
    //     _renderer = new HtmlRenderer(new StringWriter());
    //     _renderer.ObjectRenderers.RemoveAll(x => x is CodeBlockRenderer);
    //     _renderer.ObjectRenderers.Add(new HighlightedCodeBlockRenderer());
    // }

    public static async Task<string> RenderMarkdown(string markdown, CancellationToken ct = default)
    {
        var pipeline = new MarkdownPipelineBuilder()
            .UseCustomContainers()
            .UseAdvancedExtensions().Build();
        
        StringWriter stringWriter = new StringWriter();
        var renderer = new HtmlRenderer(stringWriter);
        pipeline.Setup(renderer);
        renderer.ObjectRenderers.Insert(0, new HighlightedCodeBlockRenderer());
        MarkdownDocument doc = Markdown.Parse(markdown, pipeline);
        renderer.Render(doc);
        await stringWriter.FlushAsync(ct);
        return stringWriter.ToString(); 
    }
}