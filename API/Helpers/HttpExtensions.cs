using System.Text.Json;

namespace API.Helpers
{
    public static class HttpExtensions
    {
        public static void AddingPaginationHeader (this HttpResponse response, PaginataionHeader header)
        {
            var option = new JsonSerializerOptions 
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(header));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}