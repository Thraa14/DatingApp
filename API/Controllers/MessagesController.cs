using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController : BaseApiController
    {
        public IUserRepository _userRepository { get; }
        public IMessagesRepository _messageRepository { get; }
        public IMapper _mapper { get; }
        public MessagesController(IUserRepository userRepository, IMessagesRepository messageRepository, IMapper mapper)
        {
            _mapper = mapper;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDTO>> CreateMessage (CreateMessageDTO createMessageDTO)
        {
            var username = User.GetUserName(); 

            if(username == createMessageDTO.RecipientUserName.ToLower()) 
                    return BadRequest("You Cannot Send message to Yourself.");

            var sender = await _userRepository.GetUserByUserNameAsync(username);
            var recipient = await _userRepository.GetUserByUserNameAsync(createMessageDTO.RecipientUserName);

            if(recipient == null) return NotFound();

            var message = new Message {
                Sender= sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDTO.Content
            };

            _messageRepository.AddMessage(message);

            if(await _messageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDTO>(message));

            return BadRequest("Failed to send Message!");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDTO>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUserName();
            
            var messages = await _messageRepository.GetMessagesForUser(messageParams);

            Response.AddingPaginationHeader( 
                new PaginataionHeader (messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages));

            return messages;    
        }

        [HttpGet("thread/{username}")]

        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(string username)
        {            
            var currentUsername = User.GetUserName();

            return Ok( await _messageRepository.GetMessageThread(currentUsername, username));
        }

        [HttpDelete("{id}")]

        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUserName();
            var message = await _messageRepository.GetMessage(id);

            if(message.SenderUsername != username && message.RecipientUsername != username)
                return Unauthorized();
            
            if(message.SenderUsername == username)
                message.SenderDeleted = true;

            if(message.RecipientUsername == username)
                message.RecipientDeleted = true;

            if(message.SenderDeleted && message.RecipientDeleted)
                _messageRepository.DeleteMessage(message);
            
            if( await _messageRepository.SaveAllAsync()) 
                return Ok();
            
            return BadRequest("Error Deleting the message!");
            
        }
    }
}