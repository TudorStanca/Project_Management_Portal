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
        Task<ProjectStakeholder> GetProjectStakeholder(Guid projectId, string userId);
        Task<ProjectResource> GetProjectResource(Guid projectId, string userId);
        Task<List<ProjectTask>> GetResourceProjectTasks(string userId);
        Task<List<Project>> GetProjectsByTemplateId(Guid templateId);
        Task<List<Project>> GetProjectsVisibleToUser(string userId);
        Task<List<ProjectTask>> GetTasks(TaskFilter filter);
        Task<ProjectTask> GetTask(Guid id);
    }
}
