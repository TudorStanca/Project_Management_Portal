using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Migrations
{
    /// <inheritdoc />
    public partial class StageSeeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Stages",
                columns: new[] { "Uid", "Description", "Name", "OrderNumber" },
                values: new object[,]
                {
                    { new Guid("2402bf5a-48a2-411e-b226-ee7cc32f1c84"), "Initiate the project", "Initiate", 1 },
                    { new Guid("3a38e6e3-b685-49ac-a64c-a0a2574c2a41"), "Plan the project", "Plan", 2 },
                    { new Guid("45faf5b0-4af5-45f8-bda1-79c14498dfbd"), "Execute the project", "Execute", 3 },
                    { new Guid("7402e745-2eac-4d68-81f1-236cc1ba23d7"), "Close the project", "Close", 5 },
                    { new Guid("b5d06184-6d8d-4dee-b310-ace6906e9882"), "Monitor the project", "Monitor", 4 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Stages",
                keyColumn: "Uid",
                keyValue: new Guid("2402bf5a-48a2-411e-b226-ee7cc32f1c84"));

            migrationBuilder.DeleteData(
                table: "Stages",
                keyColumn: "Uid",
                keyValue: new Guid("3a38e6e3-b685-49ac-a64c-a0a2574c2a41"));

            migrationBuilder.DeleteData(
                table: "Stages",
                keyColumn: "Uid",
                keyValue: new Guid("45faf5b0-4af5-45f8-bda1-79c14498dfbd"));

            migrationBuilder.DeleteData(
                table: "Stages",
                keyColumn: "Uid",
                keyValue: new Guid("7402e745-2eac-4d68-81f1-236cc1ba23d7"));

            migrationBuilder.DeleteData(
                table: "Stages",
                keyColumn: "Uid",
                keyValue: new Guid("b5d06184-6d8d-4dee-b310-ace6906e9882"));
        }
    }
}
