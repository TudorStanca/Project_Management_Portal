using System;
using System.Collections.Generic;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos
{
    public class TemplateDto
    {
        public Guid Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Guid> StageUids { get; set; } = [];
    }
}
