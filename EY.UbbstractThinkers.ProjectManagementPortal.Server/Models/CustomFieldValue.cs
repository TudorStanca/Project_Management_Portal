using System;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Models
{
    public class CustomFieldValue
    {
        public string Value { get; set; }
        public Guid ProjectId { get; set; }
        public Project Project { get; set; }
        public Guid CustomFieldId { get; set; }
        public CustomField CustomField { get; set; }
    }
}
