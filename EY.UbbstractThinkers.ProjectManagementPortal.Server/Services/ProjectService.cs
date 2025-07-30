using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IRepository _repository;
        private readonly AppDbContext _context;

        public ProjectService(IRepository repository, AppDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        public async Task<IEnumerable<Project>> GetProjects()
        {
            return await _repository.GetProjects();
        }
    }
}
