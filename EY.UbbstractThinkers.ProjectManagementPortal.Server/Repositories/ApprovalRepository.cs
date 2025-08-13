using EY.UbbstractThinkers.ProjectManagementPortal.Server.Data;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories
{
    public class ApprovalRepository : IApprovalRepository
    {
        private AppDbContext _context;

        public ApprovalRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<ApprovalRequest> GetApprovalRequest(Guid id)
        {
            return _context.ApprovalRequests.Include(x => x.Project).FirstOrDefaultAsync(x => x.Uid == id);
        }

        public Task<List<ApprovalRequest>> GetApprovalRequestsForUser(string id)
        {
            var finishedApprovals = _context.ApprovalRequests
                .Include(x => x.Project)
                .Include(x => x.FromStage)
                .Include(x => x.ToStage)
                .Where(x => x.Project.OwnerId == id && x.Status != ApprovalStatus.Pending);

            var pendingApprovals = _context.ApprovalRequests
                .Include(x => x.Project)
                .Include(x => x.FromStage)
                .Include(x => x.ToStage)
                .Where(x => x.Project.Stakeholders.Any(x => x.UserId == id) && x.Status == ApprovalStatus.Pending);

            var approvals = finishedApprovals.Union(pendingApprovals);

            return approvals.ToListAsync();
        }
    }
}
