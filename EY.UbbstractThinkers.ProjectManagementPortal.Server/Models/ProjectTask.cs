using System;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models
{
    public class ProjectTask
    {
        public Guid Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public TaskStatus Status { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }

        public Guid ProjectUid { get; set; }
        public Project Project { get; set; }

        public string ResourceId { get; set; }
    }
}
