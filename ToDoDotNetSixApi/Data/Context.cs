/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      06 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Context
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  06 JUL 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ToDoDotNetSixApi.Data.Entities;

namespace ToDoDotNetSixApi.Data;

public class Context : IdentityDbContext<User>
{
    public Context(DbContextOptions<Context> options) : base(options) { }

    public DbSet<Todo> Todos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Todo>(entity =>
        {
            entity.Property(e => e.Created)
                .ValueGeneratedOnAdd()
                .HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.Updated)
                .ValueGeneratedOnAdd()
                .HasDefaultValueSql("GETUTCDATE()");
        });
    }
}
