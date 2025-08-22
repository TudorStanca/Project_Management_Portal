using System;
using System.Collections.Generic;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models
{
    public class TemplateStage
    {
        public Guid TemplateId { get; set; }
        public Guid StageId { get; set; }
        public List<CustomField> CustomFields { get; set; }
    }
}
