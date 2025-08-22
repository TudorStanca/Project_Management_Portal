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
        }
    }
}
