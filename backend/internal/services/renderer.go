package services

import (
	"backend/internal/models"
	"backend/internal/views"
	"context"
	"fmt"
	"io"

	"github.com/alecthomas/chroma/v2"
	"github.com/alecthomas/chroma/v2/formatters/html"
	"github.com/alecthomas/chroma/v2/lexers"
	"github.com/alecthomas/chroma/v2/styles"
	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/ast"

	mdhtml "github.com/gomarkdown/markdown/html"
)

type Renderer interface {
	Render(models.ArticleDto) (string, error)
}

type RendererService struct {
	htmlFormatter  *html.Formatter
	highlightStyle *chroma.Style
	renderer       *mdhtml.Renderer
}

func NewRendererService(config *models.Configuration) (*RendererService, error) {
	htmlFormatter := html.New(html.TabWidth(2))
	if htmlFormatter == nil {
		return nil, fmt.Errorf("couldn't create html formatter")
	}

	highlightStyle := styles.Get(config.Style)
	if highlightStyle == nil {
		return nil, fmt.Errorf("couldn't find style %s", config.Style)
	}

	service := &RendererService{
		htmlFormatter:  htmlFormatter,
		highlightStyle: highlightStyle,
	}
	service.renderer = service.newCustomizedRender()
	return service, nil
}

func (s *RendererService) htmlHighlight(w io.Writer, source, lang, defaultLang string) error {
	if lang == "" {
		lang = defaultLang
	}
	l := lexers.Get(lang)
	if l == nil {
		l = lexers.Analyse(source)
	}
	if l == nil {
		l = lexers.Fallback
	}
	l = chroma.Coalesce(l)

	it, err := l.Tokenise(nil, source)
	if err != nil {
		return err
	}
	return s.htmlFormatter.Format(w, s.highlightStyle, it)
}

func (s *RendererService) renderCode(w io.Writer, codeBlock *ast.CodeBlock, entering bool) {
	defaultLang := ""
	lang := string(codeBlock.Info)
	s.htmlHighlight(w, string(codeBlock.Literal), lang, defaultLang)
}

func (s *RendererService) myRenderHook(w io.Writer, node ast.Node, entering bool) (ast.WalkStatus, bool) {
	if code, ok := node.(*ast.CodeBlock); ok {
		s.renderCode(w, code, entering)
		return ast.GoToNext, true
	}
	return ast.GoToNext, false
}

func (s *RendererService) newCustomizedRender() *mdhtml.Renderer {
	opts := mdhtml.RendererOptions{
		Flags:          mdhtml.CommonFlags,
		RenderNodeHook: s.myRenderHook,
	}
	return mdhtml.NewRenderer(opts)
}
func (s *RendererService) Render(article *models.ArticleDto, w io.Writer, config *models.Configuration) error {
	md := []byte(article.Body)

	html := string(markdown.ToHTML(md, nil, s.renderer))

	page := views.ArticlePage(article, html, config)

	return page.Render(context.Background(), w)
}
