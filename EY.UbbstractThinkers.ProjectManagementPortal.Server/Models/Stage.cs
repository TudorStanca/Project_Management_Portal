using System;
using System.Collections.Generic;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models
{
    public class Stage
    {
        public Guid Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int OrderNumber { get; set; }

        public List<Template> Templates { get; set; } = [];
        public List<Project> Projects { get; set; } = [];
    }
}
