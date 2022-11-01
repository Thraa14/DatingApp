using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _tokenService = tokenService;
            _mapper = mapper;
            _context = context;

        }

        [HttpPost("register")]

        public async Task<ActionResult<UserDTO>> Register (RegisterDTO registerDTO){

            if (await UserExists(registerDTO.Username)) return BadRequest("UserName is Taken");

            var user = _mapper.Map<AppUser>(registerDTO);

            using var hmac = new HMACSHA512();

            user.UserName = registerDTO.Username.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
            user.PasswordSalt = hmac.Key;
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDTO{
                Username = user.UserName,
                Token =_tokenService.CreateToken(user),
                KnownAs = user.KnownAs
            }; 

        }

        [HttpPost("Login")]

        public async Task<ActionResult<UserDTO>> Login (LoginDTO loginDTO)
        {
            var User = await _context.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(x=> x.UserName == loginDTO.Username.ToLower());

            if( User == null){
                return Unauthorized("Invalid Username");
            }

            using var hmac = new HMACSHA512(User.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

            for(int i =0 ; i < computedHash.Length ; i++){
                if (computedHash[i] != User.PasswordHash[i]){
                    return Unauthorized("Invalid Password");
                }
            }

            return new UserDTO{
                Username = User.UserName,
                Token =_tokenService.CreateToken(User),
                PhotoUrl= User.Photos.FirstOrDefault(x => x.IsMain)?.Url
            }; 
        }

        private async Task<bool> UserExists( string username){

            return await _context.Users.AnyAsync(X => X.UserName == username.ToLower());

        }

    }
}