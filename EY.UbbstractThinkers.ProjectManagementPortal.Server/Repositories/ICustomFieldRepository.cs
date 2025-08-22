using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories
{
    public interface ICustomFieldRepository
    {
        Task<CustomField> GetCustomField(Guid id);
        Task<List<CustomField>> GetCustomFields();
        Task<List<CustomField>> GetCustomFieldsByTemplateId(Guid id);
        Task<CustomFieldValue> GetCustomFieldValue(Guid projectId, Guid customFieldId);
    }
}
