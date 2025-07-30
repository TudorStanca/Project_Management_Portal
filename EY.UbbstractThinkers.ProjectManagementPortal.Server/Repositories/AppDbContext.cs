using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories
{
    public class AppDbContext : DbContext
    {
        public DbSet<Project> Projects { get; set; }

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
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
