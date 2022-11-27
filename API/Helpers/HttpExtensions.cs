using System.Text.Json;

namespace API.Helpers
{
    public static class HttpExtensions
    {
        public static void AddingPaginationHeader (this HttpResponse response, int currentPage,
            int itemsPerPage, int totalItems, int totalPages)
        {
            var paginataionHeader = new PaginataionHeader(currentPage, itemsPerPage, totalItems, totalPages);
            var option = new JsonSerializerOptions 
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginataionHeader));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}