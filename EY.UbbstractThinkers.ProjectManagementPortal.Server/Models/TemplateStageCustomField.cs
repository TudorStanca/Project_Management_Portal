using System;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models
{
    public class TemplateStageCustomField
    {
        public Guid TemplateId { get; set; }
        public Guid StageId { get; set; }
        public Guid CustomFieldId { get; set; }
        public CustomField CustomField { get; set; }
        public TemplateStage TemplateStage { get; set; }
    }
}
