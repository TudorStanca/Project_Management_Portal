using System;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos.Filters
{
    public class TaskFilter
    {
        public Guid? ProjectUid { get; set; }
        public string ResourceId { get; set; }
        public TaskStatus? Status { get; set; }
    }
}
