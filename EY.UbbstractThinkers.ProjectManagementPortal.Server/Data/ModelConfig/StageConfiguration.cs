using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Data.ModelConfig
{
    public class StageConfiguration : IEntityTypeConfiguration<Stage>
    {
        public void Configure(EntityTypeBuilder<Stage> builder)
        {
            builder.HasKey(x => x.Uid);
            builder.Property(x => x.Uid)
                .HasDefaultValueSql("NEWID()");

            builder.Property(x => x.Name)
                .HasMaxLength(250)
                .IsRequired();

            builder.Property(x => x.Description)
                .HasMaxLength(500);

            builder.Property(x => x.OrderNumber)
                .IsRequired();

            builder.HasIndex(x => x.OrderNumber)
                .IsUnique();

            builder.HasMany(x => x.Templates)
                .WithMany(x => x.Stages)
                .UsingEntity<TemplateStage>(
                    r => r.HasOne<Template>().WithMany().HasForeignKey(x => x.TemplateId),
                    l => l.HasOne<Stage>().WithMany().HasForeignKey(x => x.StageId));
        }
    }
}
