using EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var connectionString = builder.Configuration.GetConnectionString("ConnectionString");
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));
            builder.Services.AddScoped<IRepository, DbRepository>();
            builder.Services.AddScoped<IProjectService, ProjectService>();

            builder.Services.AddControllers();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure the HTTP request pipeline.

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
