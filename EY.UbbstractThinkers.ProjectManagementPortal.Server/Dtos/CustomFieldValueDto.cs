using System;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos
{
    public class CustomFieldValueDto
    {
        public object Value { get; set; }
        public Guid ProjectId { get; set; }
        public Guid CustomFieldId { get; set; }
    }
}
