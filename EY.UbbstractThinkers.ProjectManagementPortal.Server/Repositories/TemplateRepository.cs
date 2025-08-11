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

        public async Task<Stage> GetStage(Guid id)
        {
            return await _context.Stages.FirstOrDefaultAsync(x => x.Uid == id);
        }

        public async Task<List<Stage>> GetStages()
        {
            return await _context.Stages.ToListAsync();
        }

        public async Task<Template> GetTemplate(Guid id)
        {
            return await _context.Templates
                .Include(x => x.Stages)
                .FirstOrDefaultAsync(x => x.Uid == id);
        }

        public async Task<List<Template>> GetTemplates()
        {
            return await _context.Templates
                .Include(x => x.Stages)
                .ToListAsync();
        }
    }
}
