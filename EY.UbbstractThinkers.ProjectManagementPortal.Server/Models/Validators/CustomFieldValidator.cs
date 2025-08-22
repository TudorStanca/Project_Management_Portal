using EY.David.FileImportTool.Utils;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators
{
    public class CustomFieldValidator : ICustomFieldValidator
    {
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var customField = validationContext.ObjectInstance as CustomField;
            var results = new List<ValidationResult>();

            if (string.IsNullOrWhiteSpace(customField.Name))
            {
                results.Add(new ValidationResult("Name can't be empty"));
            }

            if (!string.IsNullOrWhiteSpace(customField.Name) && customField.Name.Length > ValidationConstants.MaxNameLength)
            {
                results.Add(new ValidationResult("Name can't have more than 250 characters"));
            }

            if (!string.IsNullOrWhiteSpace(customField.Description) && customField.Description.Length > ValidationConstants.MaxDescriptionLength)
            {
                results.Add(new ValidationResult("Description can't have more than 500 characters"));
            }

            if (!Enum.IsDefined(customField.Type))
            {
                results.Add(new ValidationResult("Not a valid type"));
            }

            return results;
        }
    }
}
