using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Services;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private IProjectService _projectService;
        private readonly ILogger<ProjectController> _logger;

        public ProjectController(IProjectService projectService, ILogger<ProjectController> logger)
        {
            _projectService = projectService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            var projects = await _projectService.GetProjects();

            if (projects == null || !projects.Any())
            {
                return NotFound();
            }

            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(Guid id)
        {
            var project = await _projectService.GetProject(id);

            if (project == null)
            {
                return NotFound();
            }

            return DtoUtils.MapProjectToProjectDto(project);
        }

        [HttpPost]
        public async Task<ActionResult<ProjectDto>> SaveProject(ProjectDto projectDto)
        {
            var project = await _projectService.SaveProject(DtoUtils.MapProjectDtoToProject(projectDto));

            return CreatedAtAction(
                nameof(GetProject),
                new { id = project.Uid },
                DtoUtils.MapProjectToProjectDto(project));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var project = await _projectService.GetProject(id);

            if (project == null)
            {
                return NotFound();
            }

            await _projectService.DeleteProject(project);

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProjectDto>> UpdateProject(Guid id, ProjectDto projectDto)
        {
            var project = await _projectService.UpdateProject(id, DtoUtils.MapProjectDtoToProject(projectDto));

            if (project == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
