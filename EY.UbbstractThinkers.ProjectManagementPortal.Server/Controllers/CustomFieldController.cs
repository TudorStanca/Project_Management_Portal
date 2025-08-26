using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Exceptions;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Services;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Services.Interfaces;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]s")]
    [Authorize]
    public class CustomFieldController : ControllerBase
    {
        private readonly ICustomFieldService _customFieldService;
        private readonly IProjectService _projectService;

        public CustomFieldController(ICustomFieldService customFieldService, IProjectService projectService)
        {
            _customFieldService = customFieldService;
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomFieldDto>>> GetCustomFields()
        {
            var customFields = await _customFieldService.GetCustomFields();

            if (customFields == null || customFields.Count == 0)
            {
                return NotFound();
            }

            return Ok(customFields.Select(x => DtoUtils.ToDto(x)));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomFieldDto>> GetCustomField(Guid id)
        {
            var customField = await _customFieldService.GetCustomField(id);

            if (customField == null)
            {
                return NotFound();
            }

            return DtoUtils.ToDto(customField);
        }

        [HttpPost]
        public async Task<ActionResult<CustomFieldDto>> SaveCustomField(CustomFieldDto customFieldDto)
        {
            var customField = await _customFieldService.SaveCustomField(DtoUtils.FromDto(customFieldDto));

            return CreatedAtAction(nameof(GetCustomField), new { id = customField.Uid }, DtoUtils.ToDto(customField));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCustomField(Guid id, CustomFieldDto customFieldDto)
        {
            var customField = await _customFieldService.UpdateCustomField(id, DtoUtils.FromDto(customFieldDto));

            if (customField == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomField(Guid id)
        {
            var customField = await _customFieldService.GetCustomField(id);

            if (customField == null)
            {
                return NotFound();
            }

            await _customFieldService.DeleteCustomField(customField);

            return NoContent();
        }

        [HttpGet("templates/{id}")]
        public async Task<ActionResult<IEnumerable<CustomFieldDto>>> GetCustomFieldsByTemplateId(Guid id)
        {
            var customFields = await _customFieldService.GetCustomFieldsByTemplateId(id);

            return Ok(customFields.Select(x => DtoUtils.ToDto(x)));
        }

        [HttpGet("projects/{id}")]
        public async Task<ActionResult<IEnumerable<CustomFieldDto>>> GetCustomFieldsByProjectId(Guid id)
        {
            var customFields = await _customFieldService.GetCustomFieldsByProjectId(id);

            return Ok(customFields.Select(x => DtoUtils.ToDto(x)));
        }

        [HttpPut("projects/{id}")]
        public async Task<IActionResult> SaveCustomFieldValue(Guid id, List<CustomFieldValueDto> customFieldValueDtos)
        {
            var customFieldValues = new List<CustomFieldValue>();
            var project = await _projectService.GetProject(id) ?? throw new ApiException(ErrorMessageConstants.ProjectNotFoundMessage);
            var customFields = await _customFieldService.GetCustomFieldsByTemplateId(project.TemplateUid);

            foreach (var customFieldValue in customFieldValueDtos)
            {
                var customField = customFields.FirstOrDefault(x => x.Uid == customFieldValue.CustomFieldId)
                    ?? throw new ApiException(ErrorMessageConstants.InexistentCustomField);

                var dto = DtoUtils.FromDto(customFieldValue, customField);
                customFieldValues.Add(dto);
            }

            await _customFieldService.SaveCustomFieldValues(customFieldValues, project, customFields);

            return NoContent();
        }
    }
}
