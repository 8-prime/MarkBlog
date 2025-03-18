using Markblog.Web.Endpoints;

namespace Markblog.Web.Configuration;

public static class ApiSetup
{
    public static WebApplication MapApi(this WebApplication app)
    {
        return app.MapBlogEndpoints().MapImageEndpoints().MapArticleAdminEndpoints().MapGoogleDeveloperEndpoints();
    }
}