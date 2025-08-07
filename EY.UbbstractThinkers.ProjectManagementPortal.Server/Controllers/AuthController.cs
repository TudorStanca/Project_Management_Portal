using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto user)
        {
            if (user == null)
            {
                return BadRequest("Invalid registration data.");
            }

            var newUser = new User
            {
                UserName = user.Email,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            };

            var result = await _userManager.CreateAsync(newUser, user.Password);

            if (result.Succeeded)
            {
                return Ok("User registered successfully.");
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto user)
        {
            if (user == null)
            {
                return BadRequest("Invalid login data.");
            }

            if (User.Identity.IsAuthenticated)
            {
                return Conflict("Already logged in.");
            }

            var result = await _signInManager.PasswordSignInAsync(user.Email, user.Password, isPersistent: false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                return Ok("User logged in successfully.");
            }

            return Unauthorized("Invalid login attempt.");
        }

        [HttpGet("pingauth")]
        [Authorize]
        public async Task<IActionResult> PingAuth()
        {
            var loggedUser = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return Ok(new
            {
                message = "User is logged in.",
                loggedUser.Id,
                loggedUser.Email,
                loggedUser.FirstName,
                loggedUser.LastName,
                loggedUser.ProfileImage
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            return Ok("User logged out successfully.");
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            if (!users.Any())
            {
                return NotFound();
            }

            return Ok(users.Select(x =>
            new
            {
                x.Id,
                x.Email,
                x.FirstName,
                x.LastName,
                x.ProfileImage
            }));
        }
    }
}
