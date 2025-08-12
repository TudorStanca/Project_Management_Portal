using System;
using System.Collections.Generic;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models
{
    public class Project
    {
        public Guid Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }

        public List<ProjectStakeholder> Stakeholders { get; set; } = [];
        public List<ProjectResources> Resources { get; set; } = [];
        public List<ApprovalRequest> Approvals { get; set; } = [];
        public string OwnerId { get; set; }

        public Guid TemplateUid { get; set; }
        public Template Template { get; set; }

        public Guid CurrentStageUid { get; set; }
        public Stage CurrentStage { get; set; }
    }
}
