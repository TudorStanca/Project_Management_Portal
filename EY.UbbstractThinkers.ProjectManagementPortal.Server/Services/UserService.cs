using EY.UbbstractThinkers.ProjectManagementPortal.Server.Exceptions;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators.Interfaces;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly IUserValidator _userValidator;

        public UserService(UserManager<User> userManager, IUserValidator userValidator)
        {
            _userManager = userManager;
            _userValidator = userValidator;
        }

        public async Task<User> UpdateUser(string id, User user)
        {
            var existingUser = await _userManager.FindByIdAsync(id);

            if (existingUser == null)
            {
                return null;
            }

            var userValidationResults = _userValidator.Validate(new ValidationContext(user));

            if (userValidationResults.Any())
            {
                throw new ApiException(string.Join(", ", userValidationResults));
            }

            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.ProfileImage = user.ProfileImage;

            var result = await _userManager.UpdateAsync(existingUser);

            if (!result.Succeeded)
            {
                throw new Exception("Failed to update user: " + string.Join(", ", result.Errors));
            }

            return existingUser;
        }
    }
}
