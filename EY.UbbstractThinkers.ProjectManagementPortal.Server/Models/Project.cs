using System;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models
{
    public class Project
    {
        public Guid Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
