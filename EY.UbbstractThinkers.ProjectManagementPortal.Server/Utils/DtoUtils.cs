using EY.UbbstractThinkers.ProjectManagementPortal.Server.Dtos;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Utils
{
    public class DtoUtils
    {
        public static ProjectDto MapProjectToProjectDto(Project project)
        {
            ProjectDto projectDto = new ProjectDto()
            {
                Uid = project.Uid,
                Name = project.Name,
                Description = project.Description,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
            };

            return projectDto;
        }

        public static Project MapProjectDtoToProject(ProjectDto projectDto)
        {
            Project project = new Project()
            {
                Uid = projectDto.Uid,
                Name = projectDto.Name,
                Description = projectDto.Description,
                StartDate = projectDto.StartDate,
                EndDate = projectDto.EndDate,
            };

            return project;
        }
    }
}
