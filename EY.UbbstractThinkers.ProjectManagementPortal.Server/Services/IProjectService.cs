using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<Project>> GetProjects();
        Task<Project> GetProject(Guid id);
        Task<Project> SaveProject(Project project);
        Task DeleteProject(Project project);
        Task<Project> UpdateProject(Guid id, Project project);
        Task<Project> SaveStakeholders(Project project, List<string> stakeholderIds);
        Task<Project> SaveResources(Project project, List<string> resourceIds);
        Task<IEnumerable<Project>> GetProjectsVisibleToUser(string userId);
    }
}
