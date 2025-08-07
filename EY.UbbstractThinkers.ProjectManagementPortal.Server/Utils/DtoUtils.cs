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
                OwnerId = projectDto.OwnerId
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

    }
}
