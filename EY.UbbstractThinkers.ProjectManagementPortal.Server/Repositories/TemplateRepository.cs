using EY.UbbstractThinkers.ProjectManagementPortal.Server.Data;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories
{
    public class TemplateRepository : ITemplateRepository
    {
        private AppDbContext _context;

        public TemplateRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<Stage> GetStage(Guid id)
        {
            return _context.Stages.FirstOrDefaultAsync(x => x.Uid == id);
        }

        public Task<List<Stage>> GetStages()
        {
            return _context.Stages.ToListAsync();
        }

        public Task<Template> GetTemplate(Guid id)
        {
            return _context.Templates
                .Include(x => x.Stages)
                .FirstOrDefaultAsync(x => x.Uid == id);
        }

        public Task<List<Template>> GetTemplates()
        {
            return _context.Templates
                .Include(x => x.Stages)
                .ToListAsync();
        }
    }
}
