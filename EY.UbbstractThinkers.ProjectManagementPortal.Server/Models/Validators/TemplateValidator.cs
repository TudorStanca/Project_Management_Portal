using EY.David.FileImportTool.Utils;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators.Interfaces;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators
{
    public class TemplateValidator : ITemplateValidator
    {
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var template = validationContext.ObjectInstance as Template;
            var results = new List<ValidationResult>();

            if (string.IsNullOrWhiteSpace(template.Name))
            {
                results.Add(new ValidationResult("Name can't be empty."));
            }

            if (!string.IsNullOrWhiteSpace(template.Name) && template.Name.Length > ValidationConstants.MaxNameLength)
            {
                results.Add(new ValidationResult("Name can't have more than 250 characters."));
            }

            if (!string.IsNullOrWhiteSpace(template.Description) && template.Description.Length > ValidationConstants.MaxDescriptionLength)
            {
                results.Add(new ValidationResult("Description can't have more than 500 characters."));
            }

            if (template.Stages.Count == 0)
            {
                results.Add(new ValidationResult("A template must have at least a stage."));
            }

            if (!template.Stages.Any(x => x.Name == ValidationConstants.ExecuteStageName))
            {
                results.Add(new ValidationResult("Can't create without execute stage."));
            }

            return results;
        }
    }
}
