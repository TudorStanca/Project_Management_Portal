using EY.UbbstractThinkers.ProjectManagementPortal.Server.Data;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos.Filters;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private AppDbContext _context;

        public ProjectRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<Project> GetProject(Guid id)
        {
            return _context.Projects
                .Include(x => x.Stakeholders)
                .Include(x => x.Resources)
                .Include(x => x.Tasks)
                .Include(x => x.Template)
                .Include(x => x.CurrentStage)
                .Include(x => x.Approvals)
                .FirstOrDefaultAsync(x => x.Uid == id);
        }

        public Task<Project> GetProjectByName(string name)
        {
            return _context.Projects
                .Include(x => x.Stakeholders)
                .Include(x => x.Resources)
                .Include(x => x.Tasks)
                .Include(x => x.Template)
                .Include(x => x.CurrentStage)
                .FirstOrDefaultAsync(x => x.Name == name);
        }

        public Task<List<Project>> GetProjects()
        {
            return _context.Projects
                .Include(x => x.Stakeholders)
                .Include(x => x.Resources)
                .Include(x => x.Tasks)
                .Include(x => x.Template)
                .Include(x => x.CurrentStage)
                .ToListAsync();
        }

        public Task<List<ProjectStakeholder>> GetProjectStakeholdersByProjectUid(Guid projectId)
        {
            return _context.ProjectStakeholders.Where(x => x.ProjectId == projectId).ToListAsync();
        }

        public Task<List<Project>> GetProjectsVisibleToUser(string userId)
        {
            var ownerProjects = _context.Projects.Where(x => x.OwnerId == userId);

            var stakeholderProjects = _context.Projects.Where(x => x.Stakeholders.Any(s => s.UserId == userId));

            var resourceProjects = _context.Projects.Where(x => x.Resources.Any(r => r.UserId == userId));

            var allProjects = ownerProjects
                .Union(stakeholderProjects)
                .Union(resourceProjects);

            return allProjects.ToListAsync();
        }

        public Task<List<ProjectTask>> GetTasks(TaskFilter filter)
        {
            var query = _context.ProjectTasks.AsQueryable();

            if (filter.ProjectUid != null)
            {
                query = query.Where(x => x.ProjectUid == filter.ProjectUid);
            }

            if (filter.ResourceId != null)
            {
                query = query.Where(x => x.ResourceId == filter.ResourceId);
            }

            if (filter.Status != null)
            {
                query = query.Where(x => x.Status.Equals(filter.Status));
            }

            return query.ToListAsync();
        }

        public Task<ProjectTask> GetTask(Guid id)
        {
            return _context.ProjectTasks.FirstOrDefaultAsync(x => x.Uid == id);
        }

        public Task<ProjectResources> GetResource(Guid projectId, string userId)
        {
            return _context.ProjectResources.FirstOrDefaultAsync(x => x.ProjectId == projectId && x.UserId == userId);
        }
    }
}
