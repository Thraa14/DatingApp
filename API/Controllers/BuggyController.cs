using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly DataContext _context;
        public BuggyController( DataContext context)
        {
            _context = context;            
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "Secret Text";
        }

        [HttpGet("Not-Found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var thing = _context.Users.Find(-1);

            if(thing== null) return NotFound();

            return Ok(thing);
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError ()
        {
            var thing = _context.Users.Find(-1);
            var ThingToReturn = thing.ToString();

            return ThingToReturn;
        }

        [HttpGet("Bad-Request")]
        public ActionResult<string> GetBadRequest ()
        {
            return BadRequest("This is a Bad Request");
        }

    }
}