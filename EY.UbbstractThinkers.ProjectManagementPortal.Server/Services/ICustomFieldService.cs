using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Services
{
    public interface ICustomFieldService
    {
        Task<CustomField> SaveCustomField(CustomField customField);
        Task<CustomField> GetCustomField(Guid id);
        Task DeleteCustomField(CustomField customField);
        Task<List<CustomField>> GetCustomFieldsByTemplateId(Guid id);
        Task<List<CustomField>> GetCustomFields();
        Task<List<CustomField>> GetCustomFieldsByProjectId(Guid id);
        Task SaveCustomFieldValues(List<CustomFieldValue> customFieldValues);
        Task<CustomField> UpdateCustomField(Guid id, CustomField customField);

    }
}
