using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services
{
    public interface ITemplateService
    {
        Task<IEnumerable<Stage>> GetStages();
        Task<IEnumerable<Template>> GetTemplates();
        Task<Template> GetTemplate(Guid id);
        Task<Template> SaveTemplate(Template template);
    }
}
