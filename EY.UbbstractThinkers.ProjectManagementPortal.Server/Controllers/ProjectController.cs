using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Services;
using Microsoft.AspNetCore.Mvc;
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

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            //TO DO: USE DTO'S
            var projects = await _projectService.GetProjects();

            if (projects == null || !projects.Any())
            {
                return NotFound();
            }

            return Ok(projects);
        }
    }
}
