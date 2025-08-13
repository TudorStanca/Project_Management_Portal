using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
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
                ChangedByUserEmail = approval.ModifiedByUserEmail,
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
