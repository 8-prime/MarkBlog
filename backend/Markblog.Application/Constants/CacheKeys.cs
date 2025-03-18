namespace Markblog.Application.Constants;

public static class CacheKeys
{
    private const string ArticleTextKey = "ARTICLE_TEXT";
    public static string GetArticleTextCacheKey(Guid id) => $"{ArticleTextKey}:{id}";
    
    private const string ArticleShellsKey = "ARTICLE_SHELLS";
    public static string GetArticleShellsCacheKey(int page) => $"{ArticleShellsKey}:{page}";
    
    public const string GoogleOwnerCertificate = "GOOGLE_OWNER_CERTIFICATE";
}