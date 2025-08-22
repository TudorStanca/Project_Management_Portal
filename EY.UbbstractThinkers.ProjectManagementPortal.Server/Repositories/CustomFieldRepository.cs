using EY.UbbstractThinkers.ProjectManagementPortal.Server.Data;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories
{
    public class CustomFieldRepository : ICustomFieldRepository
    {
        private AppDbContext _context;

        public CustomFieldRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<CustomField> GetCustomField(Guid id)
        {
            return _context.CustomFields
                .Include(x => x.Template)
                .Include(x => x.TemplateStages)
                .FirstOrDefaultAsync(x => x.Uid == id);
        }

        public Task<List<CustomField>> GetCustomFields()
        {
            return _context.CustomFields
                .Include(x => x.Template)
                .Include(x => x.TemplateStages)
                .Include(x => x.CustomFieldValue)
                .ToListAsync();
        }

        public Task<List<CustomField>> GetCustomFieldsByTemplateId(Guid id)
        {
            return _context.CustomFields
                .Include(x => x.TemplateStages)
                .Include(x => x.CustomFieldValue)
                .Where(x => x.TemplateId == id)
                .ToListAsync();
        }

        public Task<CustomFieldValue> GetCustomFieldValue(Guid projectId, Guid customFieldId)
        {
            return _context.CustomFieldValues
                .FirstOrDefaultAsync(x => x.ProjectId == projectId && x.CustomFieldId == customFieldId);
        }
    }
}
