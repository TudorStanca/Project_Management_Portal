using EY.UbbstractThinkers.ProjectManagementPortal.Server.Data.ModelConfig;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectTask> ProjectTasks { get; set; }
        public DbSet<ProjectStakeholder> ProjectStakeholders { get; set; }
        public DbSet<ProjectResources> ProjectResources { get; set; }
        public DbSet<Stage> Stages { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<ApprovalRequest> ApprovalRequests { get; set; }

        private string _connectionString;

        public AppDbContext() { }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public AppDbContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(_connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ProjectConfiguration());
            modelBuilder.ApplyConfiguration(new TaskConfiguration());
            modelBuilder.ApplyConfiguration(new ProjectStakeholderConfiguration());
            modelBuilder.ApplyConfiguration(new ProjectResourcesConfiguration());
            modelBuilder.ApplyConfiguration(new StageConfiguration());
            modelBuilder.ApplyConfiguration(new TemplateConfiguration());
            modelBuilder.ApplyConfiguration(new ApprovalConfiguration());
        }
    }
}
