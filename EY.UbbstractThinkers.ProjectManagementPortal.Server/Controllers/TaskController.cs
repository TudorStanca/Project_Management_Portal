using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos.Filters;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Services;
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
    public class TaskController : ControllerBase
    {
        private IProjectService _projectService;

        public TaskController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks(TaskStatus? status = null)
        {
            var taskFilter = new TaskFilter { Status = status };
            var tasks = await _projectService.GetTasks(taskFilter);

            return Ok(tasks.Select(DtoUtils.ToDto));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(Guid id)
        {
            var task = await _projectService.GetTask(id);

            if (task == null)
            {
                return NotFound();
            }

            return DtoUtils.ToDto(task);
        }

        [HttpPost]
        public async Task<ActionResult<TaskDto>> SaveTask(TaskDto taskDto)
        {
            var task = await _projectService.SaveTask(DtoUtils.FromDto(taskDto));

            return CreatedAtAction(nameof(GetTask), new { id = task.Uid }, DtoUtils.ToDto(task));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var task = await _projectService.GetTask(id);

            if (task == null)
            {
                return NotFound();
            }

            await _projectService.DeleteTask(task);

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTask(Guid id, TaskDto taskDto)
        {
            var task = await _projectService.UpdateTask(id, DtoUtils.FromDto(taskDto));

            if (task == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
