using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos
{
    public class CustomFieldDto
    {
        public Guid Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public CustomFieldType Type { get; set; }
        public Guid TemplateId { get; set; }
        public List<Guid> VisibleOnStageIds { get; set; } = [];
        public CustomFieldValueDto CustomFieldValue { get; set; }
    }
}
