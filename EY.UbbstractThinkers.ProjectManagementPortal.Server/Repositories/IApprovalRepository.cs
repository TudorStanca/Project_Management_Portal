using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories
{
    public interface IApprovalRepository
    {
        Task<ApprovalRequest> GetApprovalRequest(Guid id);
        Task<List<ApprovalRequest>> GetApprovalRequestsForUser(string id);
    }
}
