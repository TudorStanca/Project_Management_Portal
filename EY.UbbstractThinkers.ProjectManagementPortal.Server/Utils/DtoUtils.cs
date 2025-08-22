using EY.David.FileImportTool.Utils;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using System;
using System.Globalization;
using System.Linq;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Utils
{
    public class DtoUtils
    {
        public static ProjectDto ToDto(Project project)
        {
            var stakeholderIds = project.Stakeholders.Select(x => x.UserId).ToList();
            var resourceIds = project.Resources.Select(x => x.UserId).ToList();

            return new ProjectDto()
            {
                Uid = project.Uid,
                Name = project.Name,
                Description = project.Description,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                OwnerId = project.OwnerId,
                StakeholderIds = stakeholderIds,
                ResourceIds = resourceIds,
                TemplateUid = project.TemplateUid,
                CurrentStageUid = project.CurrentStageUid,
            };
        }

        public static Project FromDto(ProjectDto projectDto)
        {
            return new Project()
            {
                Uid = projectDto.Uid,
                Name = projectDto.Name,
                Description = projectDto.Description,
                StartDate = projectDto.StartDate,
                EndDate = projectDto.EndDate,
                OwnerId = projectDto.OwnerId,
                TemplateUid = projectDto.TemplateUid,
                CurrentStageUid = projectDto.CurrentStageUid,
            };
        }

        public static UserDto ToDto(User user)
        {
            return new UserDto()
            {
                Uid = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
            };
        }

        public static StageDto ToDto(Stage stage)
        {
            return new StageDto()
            {
                Uid = stage.Uid,
                Name = stage.Name,
                Description = stage.Description,
                OrderNumber = stage.OrderNumber,
            };
        }

        public static TemplateDto ToDto(Template template)
        {
            return new TemplateDto()
            {
                Uid = template.Uid,
                Name = template.Name,
                Description = template.Description,
                StageUids = template.Stages.Select(x => x.Uid).ToList()
            };
        }

        public static Stage FromDto(StageDto stage)
        {
            return new Stage()
            {
                Uid = stage.Uid,
                Name = stage.Name,
                Description = stage.Description,
                OrderNumber = stage.OrderNumber
            };
        }

        public static CustomFieldDto ToDto(CustomField customField)
        {
            return new CustomFieldDto()
            {
                Uid = customField.Uid,
                Name = customField.Name,
                Description = customField.Description,
                Type = customField.Type,
                TemplateId = customField.TemplateId,
                VisibleOnStageIds = customField.TemplateStages.Select(x => x.StageId).ToList(),
                CustomFieldValue = customField.CustomFieldValue != null ? new CustomFieldValueDto()
                {
                    Value = ConvertStringToType(customField.CustomFieldValue),
                    ProjectId = customField.CustomFieldValue.ProjectId,
                    CustomFieldId = customField.Uid
                } : null
            };
        }

        public static CustomFieldValue FromDto(CustomFieldValueDto customFieldValueDto, CustomField customField)
        {
            return new CustomFieldValue()
            {
                ProjectId = customFieldValueDto.ProjectId,
                CustomFieldId = customFieldValueDto.CustomFieldId,
                Value = customFieldValueDto.Value != null ? ConvertTypeToString(customFieldValueDto.Value, customField.Type) : null
            };
        }

        private static string ConvertTypeToString(object value, CustomFieldType type)
        {
            return type switch
            {
                CustomFieldType.Text => value.ToString(),
                CustomFieldType.Date => ((DateOnly)value).ToString(ValidationConstants.DateFormat, CultureInfo.InvariantCulture),
                _ => throw new ArgumentException("Invalid custom field type.")
            };
        }

        private static object ConvertStringToType(CustomFieldValue value)
        {
            return value.CustomField.Type switch
            {
                CustomFieldType.Text => value.Value,
                CustomFieldType.Date => DateOnly.ParseExact(value.Value, ValidationConstants.DateFormat, CultureInfo.InvariantCulture),
                _ => throw new ArgumentException("Invalid custom field type.")
            };
        }

        public static CustomField FromDto(CustomFieldDto customField)
        {
            return new CustomField()
            {
                Uid = customField.Uid,
                Name = customField.Name,
                Description = customField.Description,
                Type = customField.Type,
                TemplateId = customField.TemplateId,
                TemplateStages = customField.VisibleOnStageIds
                    .Select(x => new TemplateStage() { StageId = x })
                    .ToList()
            };
        }

        public static Template FromDto(TemplateDto template)
        {
            return new Template()
            {
                Uid = template.Uid,
                Name = template.Name,
                Description = template.Description,
                Stages = template.StageUids.Select(x => new Stage() { Uid = x }).ToList()
            };
        }

        public static ReadApprovalRequestDto ToDto(ApprovalRequest approval)
        {
            return new ReadApprovalRequestDto()
            {
                Uid = approval.Uid,
                ProjectName = approval.Project.Name,
                StageFromName = approval.FromStage.Name,
                StageToName = approval.ToStage.Name,
                Status = approval.Status,
                CreatedAt = approval.CreatedAt,
                ModifiedAt = approval.ModifiedAt,
                ModifiedByUserEmail = approval.ModifiedByUserEmail,
                CreatedByUserEmail = approval.CreatedByUserEmail
            };
        }

        public static TaskDto ToDto(ProjectTask task)
        {
            return new TaskDto()
            {
                Uid = task.Uid,
                Name = task.Name,
                Description = task.Description,
                Status = task.Status,
                StartDate = task.StartDate,
                EndDate = task.EndDate,
                ProjectUid = task.ProjectUid,
                ResourceId = task.ResourceId,
            };
        }

        public static ProjectTask FromDto(TaskDto task)
        {
            return new ProjectTask()
            {
                Uid = task.Uid,
                Name = task.Name,
                Description = task.Description,
                Status = task.Status,
                StartDate = task.StartDate,
                EndDate = task.EndDate,
                ProjectUid = task.ProjectUid,
                ResourceId = task.ResourceId,
            };
        }
    }
}
