using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
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
    public class TemplateController : ControllerBase
    {
        private ITemplateService _templateService;
        private IProjectService _projectService;

        public TemplateController(ITemplateService templateService, IProjectService projectService)
        {
            _templateService = templateService;
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TemplateDto>>> GetTemplates()
        {
            var templates = await _templateService.GetTemplates();

            return Ok(templates.Select(DtoUtils.ToDto));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateDto>> GetTemplate(Guid id)
        {
            var template = await _templateService.GetTemplate(id);

            if (template == null)
            {
                return NotFound();
            }

            return DtoUtils.ToDto(template);
        }

        [HttpGet("{id}/projects")]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjectsWithAssignedTemplate(Guid id)
        {
            var projects = await _projectService.GetProjectsWithAssignedTemplate(id);

            return Ok(projects.Select(DtoUtils.ToDto));
        }

        [HttpPost]
        public async Task<ActionResult<TemplateDto>> SaveTemplate(TemplateDto templateDto)
        {
            var template = await _templateService.SaveTemplate(DtoUtils.FromDto(templateDto));

            return CreatedAtAction(nameof(GetTemplate), new { id = template.Uid }, DtoUtils.ToDto(template));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTemplate(Guid id, TemplateDto templateDto)
        {
            var template = await _templateService.UpdateTemplate(id, DtoUtils.FromDto(templateDto));

            if (template == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
