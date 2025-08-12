using EY.UbbstractThinkers.ProjectManagementPortal.Server.Data;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Exceptions;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services
{
    public class ApprovalService : IApprovalService
    {
        private readonly AppDbContext _context;
        private readonly IApprovalRepository _approvalRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly UserManager<User> _userManager;
        private readonly IHttpContextAccessor _accesor;
        private readonly ITemplateRepository _templateRepository;

        public ApprovalService(AppDbContext context, IApprovalRepository approvalRepository, IProjectRepository projectRepository, UserManager<User> userManager, IHttpContextAccessor accessor, ITemplateRepository templateRepository)
        {
            _context = context;
            _approvalRepository = approvalRepository;
            _projectRepository = projectRepository;
            _userManager = userManager;
            _accesor = accessor;
            _templateRepository = templateRepository;
        }

        public async Task<ApprovalRequest> CreateApprovalRequest(ApprovalRequest approval)
        {
            var project = await _projectRepository.GetProject(approval.ProjectId);
            var loggedUser = await _userManager.FindByEmailAsync(_accesor.HttpContext.User.FindFirstValue(ClaimTypes.Email));

            if (project == null)
            {
                throw new ApiException(ErrorMessageConstants.ProjectNotFoundMessage);
            }

            if (project.Approvals.Any(x => x.Status == Status.Pending))
            {
                throw new ApiException(ErrorMessageConstants.OnlyOnePendingApprovalRequest);
            }

            if (loggedUser.Id != project.OwnerId)
            {
                throw new ApiException(ErrorMessageConstants.NotAnOwner);
            }

            approval.Status = Status.Pending;
            approval.FromStage = project.CurrentStage;

            var projectTemplate = await _templateRepository.GetTemplate(project.TemplateUid);
            var projectStages = projectTemplate.Stages.OrderBy(x => x.OrderNumber).ToList();
            var currentIndex = projectStages.FindIndex(stage => stage == approval.FromStage);

            if (currentIndex == projectStages.Count || currentIndex == -1)
            {
                throw new ApiException(ErrorMessageConstants.UnableToChangeStage);
            }

            approval.ToStage = projectStages[currentIndex + 1];
            approval.CreatedAt = DateTime.Now;
            approval.ModifiedAt = DateTime.Now;

            _context.ApprovalRequests.Add(approval);
            await _context.SaveChangesAsync();

            return approval;
        }

        public async Task<ApprovalRequest> GetApprovalRequest(Guid id)
        {
            var approval = await _approvalRepository.GetApprovalRequest(id);

            return approval;
        }

        public async Task<IEnumerable<ApprovalRequest>> GetApprovalRequestsForUser(string id)
        {
            var approvals = await _approvalRepository.GetApprovalRequestsForUser(id);

            return approvals;
        }

        public async Task UpdateApprovalRequest(ApprovalRequest approval, Status status)
        {
            var project = await _projectRepository.GetProject(approval.ProjectId);
            var loggedUser = await _userManager.FindByEmailAsync(_accesor.HttpContext.User.FindFirstValue(ClaimTypes.Email));

            if (!project.Stakeholders.Select(x => x.UserId).Contains(loggedUser.Id))
            {
                throw new ApiException(ErrorMessageConstants.LoggedUserNotAStakeholder);
            }

            if (approval.Status != Status.Pending)
            {
                throw new ApiException(ErrorMessageConstants.OnlyPendingApprovalRequests);
            }

            if (!Enum.IsDefined(typeof(Status), status))
            {
                throw new ApiException(ErrorMessageConstants.NotAValidStatusType);
            }

            if (status == Status.Pending)
            {
                throw new ApiException(ErrorMessageConstants.CantChangeStateToPending);
            }

            approval.Status = status;
            approval.ModifiedAt = DateTime.Now;
            approval.ModifiedByUserEmail = loggedUser.Email;

            if (status == Status.Approved)
            {
                project.CurrentStage = approval.ToStage;
            }

            await _context.SaveChangesAsync();
        }
    }
}
