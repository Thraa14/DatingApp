using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("API/[controller]")]
    
    public class BaseApiController : ControllerBase
    { 

    }

}
