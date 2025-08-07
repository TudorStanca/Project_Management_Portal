using System;
using System.Collections.Generic;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos
{
    public class ProjectDto
    {
        public Guid Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public List<string> StakeholderIds { get; set; }
        public List<string> ResourceIds { get; set; }
        public string OwnerId { get; set; }
    }
}
