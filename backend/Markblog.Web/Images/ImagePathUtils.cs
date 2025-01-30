namespace Markblog.Web.Images
{
    public class ImagePathUtils
    {
        public static string GetImageUrl(string input)
        {
            if (string.IsNullOrEmpty(input) || input.StartsWith("//") || input.StartsWith("http"))
            {
                return input;
            }
            if (input.StartsWith("./"))
            {
                input = input[2..^0];
            }
            string newSource = $"/api/images/{input}";
            return newSource;
        }
    }
}
