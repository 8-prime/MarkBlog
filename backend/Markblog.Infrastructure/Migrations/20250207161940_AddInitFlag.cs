using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Markblog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddInitFlag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsInitialized",
                schema: "auth",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsInitialized",
                schema: "auth",
                table: "AspNetUsers");
        }
    }
}
