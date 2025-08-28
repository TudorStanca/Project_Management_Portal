using System;
using System.Collections.Generic;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models
{
    public class CustomField
    {
        public Guid Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public CustomFieldType Type { get; set; }
        public Guid TemplateId { get; set; }
        public Template Template { get; set; }
        public List<TemplateStage> TemplateStages { get; set; }
        public List<CustomFieldValue> CustomFieldValues { get; set; } = [];
    }
}
