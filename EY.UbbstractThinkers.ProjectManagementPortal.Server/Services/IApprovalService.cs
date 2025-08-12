using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services
{
    public interface IApprovalService
    {
        Task<ApprovalRequest> CreateApprovalRequest(ApprovalRequest approval);
        Task UpdateApprovalRequest(ApprovalRequest approval, Status status);
        Task<ApprovalRequest> GetApprovalRequest(Guid id);
        Task<IEnumerable<ApprovalRequest>> GetApprovalRequestsForUser(string id);
    }
}
