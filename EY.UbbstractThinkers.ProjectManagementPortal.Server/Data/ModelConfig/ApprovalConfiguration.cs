using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Data.ModelConfig
{
    public class ApprovalConfiguration : IEntityTypeConfiguration<ApprovalRequest>
    {
        public void Configure(EntityTypeBuilder<ApprovalRequest> builder)
        {
            builder.HasKey(x => x.Uid);
            builder.Property(x => x.Uid)
                .HasDefaultValueSql("NEWID()");

            builder.HasOne(x => x.Project)
                .WithMany(x => x.Approvals)
                .HasForeignKey(x => x.ProjectId)
                .IsRequired();

            builder.HasOne(x => x.FromStage)
                .WithMany()
                .HasForeignKey(x => x.FromStageId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.ToStage)
                .WithMany()
                .HasForeignKey(x => x.ToStageId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Status)
                .HasDefaultValue(Status.Pending);
        }
    }
}
