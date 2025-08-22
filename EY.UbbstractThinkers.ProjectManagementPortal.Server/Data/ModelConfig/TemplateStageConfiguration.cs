using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Data.ModelConfig
{
    public class TemplateStageConfiguration : IEntityTypeConfiguration<TemplateStage>
    {
        public void Configure(EntityTypeBuilder<TemplateStage> builder)
        {
            builder.HasKey(x => new { x.TemplateId, x.StageId });
        }
    }
}
