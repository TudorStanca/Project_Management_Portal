using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Data.ModelConfig
{
    public class ProjectResourcesConfiguration : IEntityTypeConfiguration<ProjectResources>
    {
        public void Configure(EntityTypeBuilder<ProjectResources> builder)
        {
            builder.HasKey(x => new { x.ProjectId, x.UserId });
        }
    }
}
