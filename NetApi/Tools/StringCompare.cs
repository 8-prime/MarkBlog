namespace NetApi.Tools;


public static class StringCompare
{
    public static bool Contains(string source, string toCheck, StringComparison comp)
    {
        return source?.IndexOf(toCheck, comp) >= 0;
    }

    public static bool Cnc(string source, string toCheck)
    {
        return Contains(source, toCheck, StringComparison.OrdinalIgnoreCase);
    }
}