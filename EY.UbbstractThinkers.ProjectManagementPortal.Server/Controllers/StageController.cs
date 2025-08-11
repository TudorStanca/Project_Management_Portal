using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Services;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class StageController : ControllerBase
    {
        private ITemplateService _templateService;
        private readonly ILogger<ProjectController> _logger;

        public StageController(ITemplateService templateService, ILogger<ProjectController> logger)
        {
            _templateService = templateService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StageDto>>> GetStages()
        {
            var stages = await _templateService.GetStages();

            return Ok(stages.Select(DtoUtils.ToDto));
        }
    }
}
