using System.Text;
using ColorCode;
using Markdig.Helpers;
using Markdig.Renderers;
using Markdig.Renderers.Html;
using Markdig.Syntax;

namespace Markblog.Application.HtmlRendering;

public class HighlightedCodeBlockRenderer : CodeBlockRenderer
{
    protected override void Write(HtmlRenderer renderer, CodeBlock obj)
    {
        if (obj is not FencedCodeBlock fencedCodeBlock) return;
        var language = fencedCodeBlock.Info;
        if (language == null)
        {
            base.Write(renderer, obj);
            return;
        }
        var highlighterLang = Languages.FindById(language);
        if (highlighterLang == null)
        {
            base.Write(renderer, obj);
            return;
        }
                
        var rawString = GetCodeContent(obj);
        var formatter = new HtmlFormatter();
        var highlighted = formatter.GetHtmlString(rawString, highlighterLang);
        
        renderer.Write(highlighted);
    }
    
    private static string GetCodeContent(CodeBlock codeBlock)
    {
        if (codeBlock.Lines.Lines.Length <= 0) return string.Empty;
        var stringBuilder = new StringBuilder();
        // Iterate through all lines in the code block
        for (var i = 0; i < codeBlock.Lines.Count; i++)
        {
            var line = codeBlock.Lines.Lines[i];
            var slice = line.Slice;

            if (slice.Text == null) continue;
            stringBuilder.Append(slice.Text.AsSpan(slice.Start, slice.Length));
                    
            if (i < codeBlock.Lines.Count - 1)
            {
                stringBuilder.AppendLine();
            }
        }
        return stringBuilder.ToString();
    }

}