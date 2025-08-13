using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services
{
    public interface IApprovalService
    {
        Task<ApprovalRequest> SaveApprovalRequest(ApprovalRequest approval);
        Task UpdateApprovalRequest(ApprovalRequest approval, ApprovalStatus status);
        Task<ApprovalRequest> GetApprovalRequest(Guid id);
        Task<List<ApprovalRequest>> GetApprovalRequestsForUser(string id);
    }
}
