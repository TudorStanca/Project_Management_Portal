using EY.UbbstractThinkers.ProjectManagementPortal.Server.Exceptions;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            Log.Logger = new LoggerConfiguration()
                .WriteTo.Console()
                .CreateLogger();

            // Add services to the container.
            var connectionString = builder.Configuration.GetConnectionString("ConnectionString");
            builder.Host.UseSerilog((context, loggerConfiguration) =>
            {
                loggerConfiguration.WriteTo.Console();
                loggerConfiguration.ReadFrom.Configuration(context.Configuration);
            });
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));
            builder.Services.AddScoped<IRepository, DbRepository>();
            builder.Services.AddScoped<IProjectValidator, ProjectValidator>();
            builder.Services.AddScoped<IProjectService, ProjectService>();
            builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
            builder.Services.AddProblemDetails();

            builder.Services.AddControllers();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure the HTTP request pipeline.

            app.UseHttpsRedirection();

            app.UseExceptionHandler();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
