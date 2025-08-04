using EY.David.FileImportTool.Utils;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators
{
    public class ProjectValidator : IProjectValidator
    {
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var project = validationContext.ObjectInstance as Project;
            var results = new List<ValidationResult>();

            if (string.IsNullOrWhiteSpace(project.Name))
            {
                results.Add(new ValidationResult("Name can't be empty"));
            }

            if (!string.IsNullOrWhiteSpace(project.Name) && project.Name.Length > ValidationConstants.MaxNameLength)
            {
                results.Add(new ValidationResult("Name can't have more than 250 characters"));
            }

            if (!string.IsNullOrWhiteSpace(project.Description) && project.Description.Length > ValidationConstants.MaxDescriptionLength)
            {
                results.Add(new ValidationResult("Description can't have more than 500 characters"));
            }

            if (project.StartDate == DateOnly.MinValue)
            {
                results.Add(new ValidationResult("Start Date can't be empty"));
            }

            string formattedStartDate = project.StartDate.ToString(ValidationConstants.DateFormat, CultureInfo.InvariantCulture);

            if (!DateTime.TryParseExact(formattedStartDate, ValidationConstants.DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
            {
                results.Add(new ValidationResult("Start date must be in correct format"));
            }

            if (project.EndDate.HasValue)
            {
                if (project.EndDate.Value <= project.StartDate)
                {
                    results.Add(new ValidationResult("End Date can't be before start date"));
                }

                string formattedEndDate = project.EndDate.Value.ToString(ValidationConstants.DateFormat, CultureInfo.InvariantCulture);

                if (!DateTime.TryParseExact(formattedEndDate, ValidationConstants.DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                {
                    results.Add(new ValidationResult("End Date must be in correct format"));
                }
            }

            return results;
        }
    }
}
