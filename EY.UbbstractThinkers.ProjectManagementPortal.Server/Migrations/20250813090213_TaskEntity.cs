using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Migrations
{
    /// <inheritdoc />
    public partial class TaskEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChangedByUserEmail",
                table: "ApprovalRequests");

            migrationBuilder.AddColumn<string>(
                name: "ModifiedByUserEmail",
                table: "ApprovalRequests",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProjectTasks",
                columns: table => new
                {
                    Uid = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ProjectUid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResourceId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTasks", x => x.Uid);
                    table.ForeignKey(
                        name: "FK_ProjectTasks_Projects_ProjectUid",
                        column: x => x.ProjectUid,
                        principalTable: "Projects",
                        principalColumn: "Uid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_ProjectUid",
                table: "ProjectTasks",
                column: "ProjectUid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "ModifiedByUserEmail",
                table: "ApprovalRequests");

            migrationBuilder.AddColumn<string>(
                name: "ChangedByUserEmail",
                table: "ApprovalRequests",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
