using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Data.ModelConfig
{
    public class CustomFieldConfiguration : IEntityTypeConfiguration<CustomField>
    {
        public void Configure(EntityTypeBuilder<CustomField> builder)
        {
            builder.HasKey(x => x.Uid);
            builder.Property(x => x.Uid)
                .HasDefaultValueSql("NEWID()");

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(250);

            builder.Property(x => x.Description)
                .HasMaxLength(500);

            builder.Property(x => x.Type)
                .IsRequired();

            builder.HasOne(x => x.Template)
                .WithMany(x => x.CustomFields)
                .HasForeignKey(x => x.TemplateId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.TemplateStages)
                .WithMany(x => x.CustomFields)
                .UsingEntity<TemplateStageCustomField>(
                   r => r.HasOne(x => x.TemplateStage).WithMany().HasForeignKey(x => (new { x.TemplateId, x.StageId })).OnDelete(DeleteBehavior.Restrict),
                   l => l.HasOne(x => x.CustomField).WithMany().HasForeignKey(x => x.CustomFieldId));
        }
    }
}
