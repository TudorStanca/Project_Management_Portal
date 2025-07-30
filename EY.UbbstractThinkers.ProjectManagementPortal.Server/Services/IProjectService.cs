using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<Project>> GetProjects();
    }
}
