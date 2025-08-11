using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Data.ModelConfig
{
    public class TemplateConfiguration : IEntityTypeConfiguration<Template>
    {
        public void Configure(EntityTypeBuilder<Template> builder)
        {
            builder.HasKey(x => x.Uid);
            builder.Property(x => x.Uid)
                .HasDefaultValueSql("NEWID()");

            builder.Property(x => x.Name)
                .HasMaxLength(250)
                .IsRequired();

            builder.Property(x => x.Description)
                .HasMaxLength(500);

            builder.HasMany(x => x.Stages)
            .WithMany(x => x.Templates)
            .UsingEntity(
                "TemplateStages",
                r => r.HasOne(typeof(Stage)).WithMany().HasForeignKey("StageId").HasPrincipalKey(nameof(Stage.Uid)),
                l => l.HasOne(typeof(Template)).WithMany().HasForeignKey("TemplateId").HasPrincipalKey(nameof(Template.Uid)),
                j => j.HasKey("StageId", "TemplateId"));
        }
    }
}
