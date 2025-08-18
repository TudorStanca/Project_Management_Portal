using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services
{
    public interface ITemplateService
    {
        Task<List<Stage>> GetStages();
        Task<List<Template>> GetTemplates();
        Task<Template> GetTemplate(Guid id);
        Task<Template> SaveTemplate(Template template);
        Task<Template> UpdateTemplate(Guid id, Template template);
    }
}
