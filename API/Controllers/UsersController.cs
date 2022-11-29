using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IPhotoService _photoService;

        private readonly IMapper _mapper ;

        public UsersController( IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _mapper = mapper;
            _photoService = photoService;
            _userRepository = userRepository;    
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers ([FromQuery]UserParams userParams )
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());
            userParams.CurrentUsername = User.GetUserName();
            if ( string.IsNullOrEmpty(userParams.Gender)) {
                userParams.Gender = user.Gender == "male"? "female" : "male";
            }

            var users = await _userRepository.GetMembersASync(userParams);
            Response.AddingPaginationHeader( new PaginataionHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
            return Ok(users);
        }

        [HttpGet("{username}", Name ="GetUser")]
        public async Task<ActionResult<MemberDTO>> GetUser (string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }   

        [HttpPut]
        public async Task<ActionResult> UpdateUser (MemberUpdateDTO memberUpdateDTO)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());

            _mapper.Map(memberUpdateDTO, user);
            _userRepository.Update(user);

            if(await _userRepository.SaveAllAsync()){
                 return NoContent();
            }

            return BadRequest("Failed to Update User!");
        }

        [Authorize]
        [HttpPost("add-photo")]
         public async Task<ActionResult<PhotoDTO>> UploadPhoto(IFormFile file)
        {
             var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());
             var result = await _photoService.AddPhotoAsync(file);
            
            if(result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync())
            {
               return CreatedAtRoute("GetUser", new {username = user.UserName} , _mapper.Map<PhotoDTO>(photo));
            }

            return BadRequest("Uploading Photo failed!");
        }



        [HttpPut("Set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());
            var photo = user.Photos.FirstOrDefault(x => x.id == photoId);

            if(photo.IsMain) return BadRequest("This is already your Main photo!");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            if(currentMain != null) currentMain.IsMain= false;

            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed To set Main photo");
        }


         [HttpDelete("delete-photo/{photoId}")]

         public async Task<ActionResult> DeletePhoto (int photoId)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());
            var photo = user.Photos.FirstOrDefault(x => x.id == photoId);

            if(photo == null) return NotFound();
            if(photo.IsMain) return BadRequest(" You Can Not delete your main photo! ");

            if(photo.PublicId !=null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null) return BadRequest (result.Error.Message);
            }

            user.Photos.Remove(photo);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to Delete Photo.. Try again! ");
        }

    }
}