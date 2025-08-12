using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedApprovals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Approvals",
                columns: table => new
                {
                    Uid = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StageFromId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StageToId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Approvals", x => x.Uid);
                    table.ForeignKey(
                        name: "FK_Approvals_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Uid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Approvals_Stages_StageFromId",
                        column: x => x.StageFromId,
                        principalTable: "Stages",
                        principalColumn: "Uid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Approvals_Stages_StageToId",
                        column: x => x.StageToId,
                        principalTable: "Stages",
                        principalColumn: "Uid",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Approvals_ProjectId",
                table: "Approvals",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Approvals_StageFromId",
                table: "Approvals",
                column: "StageFromId");

            migrationBuilder.CreateIndex(
                name: "IX_Approvals_StageToId",
                table: "Approvals",
                column: "StageToId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Approvals");
        }
    }
}
