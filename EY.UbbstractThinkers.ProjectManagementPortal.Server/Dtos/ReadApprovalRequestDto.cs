using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos
{
    public class ReadApprovalRequestDto
    {
        public Guid Uid { get; set; }
        public string ProjectName { get; set; }
        public string StageFromName { get; set; }
        public string StageToName { get; set; }
        public ApprovalStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public string ModifiedByUserEmail { get; set; }
        public string CreatedByUserEmail { get; set; }
    }
}
