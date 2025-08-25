using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos.Filters;
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
    public class ProjectController : ControllerBase
    {
        private IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            var projects = await _projectService.GetProjects();

            if (projects == null || projects.Count == 0)
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
        public async Task<ActionResult> UpdateProject(Guid id, ProjectDto projectDto)
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
            var projects = await _projectService.GetProjectsVisibleToUser(id);

            return Ok(projects.Select(DtoUtils.ToDto));
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

        [HttpPost("{id}/approvals")]
        public async Task<IActionResult> AdvanceToNextStage(Guid id)
        {
            await _projectService.AdvanceToNextStage(id);

            return Ok();
        }

        [HttpGet("{id}/approvals/open")]
        public async Task<ActionResult<bool>> IsPendingApprovalRequestOpen(Guid id)
        {
            var project = await _projectService.GetProject(id);

            if (project == null)
            {
                return NotFound();
            }

            var isOpen = _projectService.IsPendingApprovalRequestOpen(project);

            return Ok(isOpen);
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

        [HttpGet("{projectUid}/tasks")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetProjectTasks(Guid projectUid)
        {
            var taskFilter = new TaskFilter { ProjectUid = projectUid };
            var tasks = await _projectService.GetTasks(taskFilter);

            return Ok(tasks.Select(DtoUtils.ToDto));
        }

        [HttpGet("{projectUid}/resources/{resourceId}/tasks")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetResourceTasks(Guid projectUid, string resourceId)
        {
            var taskFilter = new TaskFilter { ProjectUid = projectUid, ResourceId = resourceId };
            var tasks = await _projectService.GetTasks(taskFilter);

            return Ok(tasks.Select(DtoUtils.ToDto));
        }
    }
}
