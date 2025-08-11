using System;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos
{
    public class StageDto
    {
        public Guid Uid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int OrderNumber { get; set; }
    }
}
