using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserlike(int sourceUserId , int targetUserId);
        Task<AppUser> GetUserWithLikes (int userId);
        Task<PagedList<LikesDTO>> GetUserLikes(LikesParams likesParams);

    }
}