using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Data.ModelConfig
{
    public class ProjectStakeholderConfiguration : IEntityTypeConfiguration<ProjectStakeholder>
    {
        public void Configure(EntityTypeBuilder<ProjectStakeholder> builder)
        {
            builder.HasKey(x => new { x.ProjectId, x.UserId });
        }
    }
}
