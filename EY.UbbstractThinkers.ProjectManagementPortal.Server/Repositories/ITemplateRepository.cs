using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories
{
    public interface ITemplateRepository
    {
        Task<List<Stage>> GetStages();
        Task<Stage> GetStage(Guid id);
        Task<List<Template>> GetTemplates();
        Task<Template> GetTemplate(Guid id);
    }
}
