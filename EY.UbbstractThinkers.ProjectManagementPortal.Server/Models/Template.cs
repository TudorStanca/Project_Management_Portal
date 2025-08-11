using System;
using System.Collections.Generic;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models
{
    public class Template
    {
        public Guid Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public List<Stage> Stages { get; set; } = [];
        public List<Project> Projects { get; set; } = [];
    }
}
