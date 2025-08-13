using EY.David.FileImportTool.Utils;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Exceptions;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators.Interfaces;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Utils;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators
{
    public class TaskValidator : ITaskValidator
    {
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var task = validationContext.ObjectInstance as ProjectTask;
            var results = new List<ValidationResult>();

            if (string.IsNullOrWhiteSpace(task.Name))
            {
                results.Add(new ValidationResult("Task name is required."));
            }

            if (task.Name.Length > ValidationConstants.MaxNameLength)
            {
                results.Add(new ValidationResult("Task name too long."));
            }

            if (task.Description != null && task.Description.Length > ValidationConstants.MaxDescriptionLength)
            {
                results.Add(new ValidationResult("Task description too long."));
            }

            if (!Enum.IsDefined(task.Status))
            {
                throw new ApiException(ErrorMessageConstants.NotAValidStatusType);
            }

            if (task.StartDate == DateOnly.MinValue)
            {
                results.Add(new ValidationResult("Start Date can't be empty."));
            }

            if (task.EndDate.HasValue)
            {
                if (task.EndDate.Value <= task.StartDate)
                {
                    results.Add(new ValidationResult("End Date can't be before start date."));
                }
            }

            if (task.ProjectUid == Guid.Empty)
            {
                results.Add(new ValidationResult("Task must be assigned to a project."));
            }

            return results;
        }
    }
}
