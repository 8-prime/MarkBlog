namespace Markblog.Application.Services;

public static class ReadDurationService
{
    private const int WordsPerMinute = 250;
    
    public static int GetReadDurationSeconds(string text)
    {
        return text.Split(" ").Length / WordsPerMinute;
    }
}