using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
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
    public class ApprovalController : ControllerBase
    {
        private readonly IApprovalService _approvalService;

        public ApprovalController(IApprovalService approvalService)
        {
            _approvalService = approvalService;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateApprovalRequest(Guid id, WriteApprovalRequestDto writeApprovalRequestDto)
        {
            var approval = await _approvalService.GetApprovalRequest(id);

            if (approval == null)
            {
                return NotFound();
            }

            await _approvalService.UpdateApprovalRequest(approval, writeApprovalRequestDto.Status);

            return NoContent();
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<IEnumerable<ReadApprovalRequestDto>>> GetApprovalsForUser(string id)
        {
            var approvals = await _approvalService.GetApprovalRequestsForUser(id);

            var approvalDtos = approvals.Select(DtoUtils.ToDto);

            return Ok(approvalDtos);
        }
    }
}
