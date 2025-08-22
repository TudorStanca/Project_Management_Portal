using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Data.ModelConfig
{
    public class TemplateStageCustomFieldConfiguration : IEntityTypeConfiguration<TemplateStageCustomField>
    {
        public void Configure(EntityTypeBuilder<TemplateStageCustomField> builder)
        {
            builder.HasKey(x => new { x.TemplateId, x.StageId, x.CustomFieldId });
        }
    }
}
