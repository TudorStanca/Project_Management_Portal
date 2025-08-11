using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Services;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Utils;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
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

            return Ok(projects.Select(x => DtoUtils.ToDto(x)));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(Guid id)
        {
            var project = await _projectService.GetProject(id);

            if (project == null)
            {
                return NotFound();
            }

            return DtoUtils.ToDto(project);
        }

        [HttpPost]
        public async Task<ActionResult<ProjectDto>> SaveProject(ProjectDto projectDto)
        {
            var project = await _projectService.SaveProject(DtoUtils.FromDto(projectDto));

            return CreatedAtAction(nameof(GetProject), new { id = project.Uid }, DtoUtils.ToDto(project));
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
            var project = await _projectService.UpdateProject(id, DtoUtils.FromDto(projectDto));

            if (project == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<ProjectDto>> GetProjectsForUser(string id)
        {
            var allProjects = await _projectService.GetProjectsVisibleToUser(id);

            return Ok(allProjects);
        }

        [HttpPost("{id}/stakeholders")]
        public async Task<IActionResult> SaveStakeholders(Guid id, List<string> stakeholderIds)
        {
            var project = await _projectService.GetProject(id);

            if (project == null)
            {
                return NotFound();
            }

            await _projectService.SaveStakeholders(project, stakeholderIds);

            return Created();
        }

        [HttpPost("{id}/resources")]
        public async Task<IActionResult> SaveResources(Guid id, List<string> resourceIds)
        {
            var project = await _projectService.GetProject(id);

            if (project == null)
            {
                return NotFound();
            }

            await _projectService.SaveResources(project, resourceIds);

            return Created();
        }

        [HttpDelete("{id}/stakeholders")]
        public async Task<IActionResult> DeleteStakeholders(Guid id, List<string> stakeholderIds)
        {
            var project = await _projectService.GetProject(id);

            if (project == null)
            {
                return NotFound();
            }

            await _projectService.DeleteStakeholders(project, stakeholderIds);

            return NoContent();
        }

        [HttpDelete("{id}/resources")]
        public async Task<IActionResult> DeleteResources(Guid id, List<string> resourceIds)
        {
            var project = await _projectService.GetProject(id);

            if (project == null)
            {
                return NotFound();
            }

            await _projectService.DeleteResources(project, resourceIds);

            return NoContent();
        }
    }
}
