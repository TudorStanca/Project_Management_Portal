using EY.UbbstractThinkers.ProjectManagementPortal.Server.Data;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories
{
    public class DbRepository : IRepository
    {
        private AppDbContext _context;

        public DbRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Project> GetProject(Guid id)
        {
            return await _context.Projects
                .Include(x => x.Stakeholders)
                .Include(x => x.Resources)
                .FirstOrDefaultAsync(x => x.Uid == id);
        }

        public async Task<Project> GetProjectByName(string name)
        {
            return await _context.Projects
                .Include(x => x.Stakeholders)
                .Include(x => x.Resources)
                .FirstOrDefaultAsync(x => x.Name == name);
        }

        public async Task<IEnumerable<Project>> GetProjects()
        {
            return await _context.Projects
                .Include(x => x.Stakeholders)
                .Include(x => x.Resources)
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
    }
}
