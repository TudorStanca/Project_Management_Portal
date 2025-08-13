using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos.Filters;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services
{
    public interface IProjectService
    {
        Task<List<Project>> GetProjects();
        Task<Project> GetProject(Guid id);
        Task<Project> SaveProject(Project project);
        Task DeleteProject(Project project);
        Task<Project> UpdateProject(Guid id, Project project);
        Task<Project> SaveStakeholders(Project project, List<string> stakeholderIds);
        Task<Project> SaveResources(Project project, List<string> resourceIds);
        Task<List<Project>> GetProjectsVisibleToUser(string userId);
        Task DeleteStakeholders(Project project, List<string> stakeholderIds);
        Task DeleteResources(Project project, List<string> resourceIds);
        Task AdvanceToNextStage(Guid id);
        Task<List<ProjectTask>> GetTasks(TaskFilter filter);
        Task<ProjectTask> GetTask(Guid id);
        Task<ProjectTask> SaveTask(ProjectTask task);
        Task DeleteTask(Models.ProjectTask task);
        Task<ProjectTask> UpdateTask(Guid id, ProjectTask task);
        bool IsPendingApprovalRequestOpen(Project project);
    }
}
