using System;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models
{
    public class ApprovalRequest
    {
        public Guid Uid { get; set; }
        public Guid ProjectId { get; set; }
        public Project Project { get; set; }
        public Guid? FromStageId { get; set; }
        public Stage FromStage { get; set; }
        public Guid? ToStageId { get; set; }
        public Stage ToStage { get; set; }
        public Status Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public string ModifiedByUserEmail { get; set; }
    }
}
