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
    public class TemplateController : ControllerBase
    {
        private ITemplateService _templateService;
        private readonly ILogger<ProjectController> _logger;

        public TemplateController(ITemplateService templateService, ILogger<ProjectController> logger)
        {
            _templateService = templateService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TemplateDto>>> GetTemplates()
        {
            var templates = await _templateService.GetTemplates();

            if (!templates.Any())
            {
                return NotFound();
            }

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

        [HttpPost]
        public async Task<ActionResult<TemplateDto>> SaveTemplate(TemplateDto templateDto)
        {
            var template = await _templateService.SaveTemplate(DtoUtils.FromDto(templateDto));

            return CreatedAtAction(nameof(GetTemplate), new { id = template.Uid }, DtoUtils.ToDto(template));
        }
    }
}
