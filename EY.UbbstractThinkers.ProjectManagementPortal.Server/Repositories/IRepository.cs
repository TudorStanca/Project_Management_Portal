using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories
{
    public interface IRepository
    {
        Task<IEnumerable<Project>> GetProjects();
    }
}
