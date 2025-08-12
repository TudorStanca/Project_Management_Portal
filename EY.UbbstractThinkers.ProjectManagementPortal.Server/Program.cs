using EY.UbbstractThinkers.ProjectManagementPortal.Server.Data;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Exceptions;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Models.Validators.Interfaces;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Repositories;
using EY.UbbstractThinkers.ProjectManagementPortal.Server.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System.Threading.Tasks;

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

            builder.Services.AddDbContext<UserDbContext>(options => options.UseSqlServer(connectionString));

            builder.Services.AddAuthorization();
            builder.Services
                .AddAuthentication()
                .AddCookie(IdentityConstants.ApplicationScheme, options =>
                {
                    options.LoginPath = "/api/auth/login";
                    options.LogoutPath = "/api/auth/logout";

                    options.Events = new CookieAuthenticationEvents()
                    {
                        OnRedirectToLogin = context =>
                        {
                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

                            return Task.CompletedTask;
                        }
                    };
                });

            builder.Services.AddIdentityCore<User>()
                .AddEntityFrameworkStores<UserDbContext>()
                .AddDefaultTokenProviders()
                .AddSignInManager<SignInManager<User>>();

            builder.Host.UseSerilog((context, loggerConfiguration) =>
            {
                loggerConfiguration.WriteTo.Console();
                loggerConfiguration.ReadFrom.Configuration(context.Configuration);
            });
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));
            builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
            builder.Services.AddScoped<ITemplateRepository, TemplateRepository>();
            builder.Services.AddScoped<IProjectValidator, ProjectValidator>();
            builder.Services.AddScoped<ITemplateValidator, TemplateValidator>();
            builder.Services.AddScoped<IProjectService, ProjectService>();
            builder.Services.AddScoped<ITemplateService, TemplateService>();
            builder.Services.AddScoped<IApprovalRepository, ApprovalRepository>();
            builder.Services.AddScoped<IApprovalService, ApprovalService>();
            builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
            builder.Services.AddProblemDetails();

            builder.Services.AddControllers();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure the HTTP request pipeline.

            app.UseHttpsRedirection();

            app.UseExceptionHandler();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
