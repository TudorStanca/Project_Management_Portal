using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Migrations
{
    /// <inheritdoc />
    public partial class CreatedProjectForeignKeysToTemplateAndStage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CurrentStageUid",
                table: "Projects",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "TemplateUid",
                table: "Projects",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CurrentStageUid",
                table: "Projects",
                column: "CurrentStageUid");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_TemplateUid",
                table: "Projects",
                column: "TemplateUid");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Stages_CurrentStageUid",
                table: "Projects",
                column: "CurrentStageUid",
                principalTable: "Stages",
                principalColumn: "Uid",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Templates_TemplateUid",
                table: "Projects",
                column: "TemplateUid",
                principalTable: "Templates",
                principalColumn: "Uid",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Stages_CurrentStageUid",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Templates_TemplateUid",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_CurrentStageUid",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_TemplateUid",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CurrentStageUid",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "TemplateUid",
                table: "Projects");
        }
    }
}
