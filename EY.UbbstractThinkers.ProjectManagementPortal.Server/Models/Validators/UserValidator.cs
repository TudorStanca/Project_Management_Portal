using EY.David.FileImportTool.Utils;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators.Interfaces;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators
{
    public class UserValidator : IUserValidator
    {
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var user = validationContext.ObjectInstance as User;
            var results = new List<ValidationResult>();

            if (string.IsNullOrWhiteSpace(user.FirstName))
            {
                results.Add(new ValidationResult("First name can't be empty."));
            }

            if (!string.IsNullOrWhiteSpace(user.FirstName) && user.FirstName.Length > ValidationConstants.MaxNameLength)
            {
                results.Add(new ValidationResult("First name can't have more than 250 characters."));
            }

            if (string.IsNullOrWhiteSpace(user.LastName))
            {
                results.Add(new ValidationResult("Last name can't be empty."));
            }

            if (!string.IsNullOrWhiteSpace(user.LastName) && user.LastName.Length > ValidationConstants.MaxNameLength)
            {
                results.Add(new ValidationResult("Last name can't have more than 250 characters."));
            }

            if (user.ProfileImage != null && user.ProfileImage.Length == 0)
            {
                results.Add(new ValidationResult("Profile image is empty."));
            }

            if (user.ProfileImage != null && user.ProfileImage.Length > ValidationConstants.MaxFileSize)
            {
                results.Add(new ValidationResult("File size exceeds 1 MB."));
            }

            return results;
        }
    }
}
