using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos.Filters;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories
{
    public interface IProjectRepository
    {
        Task<List<Project>> GetProjects();
        Task<Project> GetProject(Guid id);
        Task<Project> GetProjectByName(string name);
        Task<List<ProjectStakeholder>> GetProjectStakeholdersByProjectUid(Guid projectId);
        Task<List<Project>> GetProjectsVisibleToUser(string userId);
        Task<List<ProjectTask>> GetTasks(TaskFilter filter);
        Task<ProjectTask> GetTask(Guid id);
        Task<ProjectResources> GetResource(Guid projectId, string userId);
    }
}
