using System.Text;

namespace Markblog.Application.Services;

public static class ReadDurationService
{
    private const int WordsPerMinute = 250;

    public static int GetReadDurationSeconds(string text)
    {
        var minutes = (double)text.Length / WordsPerMinute;
        return (int)Math.Ceiling(minutes * 60); // Round up to the nearest second
    }

    public static string GetReadDurationText(int readDurationSeconds)
    {
        var hours = readDurationSeconds / 3600;
        var remainder = readDurationSeconds % 3600;
        var minutes = remainder / 60;
        var seconds = remainder % 60;

        var sb = new StringBuilder();
        if (hours > 0)
        {
            sb.Append($"{hours}h ");
        }
        if (minutes > 0)
        {
            sb.Append($"{minutes}m ");
        }
        sb.Append($"{seconds}s ");
        sb.Append("read duration");
        return sb.ToString();
    }
}