using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikesRepository _likesRepository;

        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _userRepository = userRepository;
            _likesRepository = likesRepository;
        }


        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username){
            var sourceUserId = User.GetUserId();
            var likedUser = await _userRepository.GetUserByUserNameAsync(username);
            var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

            if(likedUser == null) return NotFound();

            if(sourceUser.UserName == username) return BadRequest(" You Can NOT like Yourself.");

            var userLike = await _likesRepository.GetUserlike(sourceUserId, likedUser.Id);

            if(userLike != null) return BadRequest("You already Like this User.");

            userLike = new UserLike {
                SourceUserId = sourceUserId,
                TargetUserId = likedUser.Id,
            };

            sourceUser.LikedUsers.Add(userLike);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to Like this User!");            
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikesDTO>>> GetUserLikes([FromQuery] LikesParams likesParams){
            likesParams .userId = User.GetUserId();
            var users = await _likesRepository.GetUserLikes(likesParams);
            Response.AddingPaginationHeader( new PaginataionHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
            return Ok(users);
        }
    }
}