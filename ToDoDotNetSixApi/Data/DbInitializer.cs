/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      06 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  DB Initializer
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  06 JUL 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ToDoDotNetSixApi.Data.Entities;

namespace ToDoDotNetSixApi.Data;

public class DbInitializer
{
    /// <summary>
    /// Initialise DB
    /// </summary>
    /// <param name="context"></param>
    public async static Task Initialize(Context context, UserManager<User> userManager)
    {
        context.Database.EnsureCreated();

        await SetupDefaultUser(userManager);

        if (context.Todos.Any())
            return;   // DB has been seeded

        SetupUpdateTrigger(context);
        SetupNextLogIdSequence(context);

        SetupTodos(context);
    }

    /// <summary>
    /// Setup Default User
    /// </summary>
    /// <param name="userManager"></param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    private static async Task SetupDefaultUser(UserManager<User> userManager)
    {
        User user = await userManager.FindByNameAsync("user");
        if (user == null)
        {
            user = new User()
            {
                FirstName = "User",
                LastName = "Todo",
                Email = "user@Todo.DotNetSix",
                UserName = "user"
            };

            var result = await userManager.CreateAsync(user, "P@ssw0rd!");
            if (!result.Succeeded)
                throw new InvalidOperationException("Could not create user: User");
        }
    }

    /// <summary>
    /// Setup Todos
    /// </summary>
    /// <param name="context"></param>
    private static void SetupTodos(Context context)
    {
        // On creation create Todos data
        context.Todos.Add(new Entities.Todo("Dog", "Take the dog for a walk", "user"));
        context.Todos.Add(new Entities.Todo("Rubbish", "Put the rubbish out", "user"));
        context.Todos.Add(new Entities.Todo("Boiler", "Check the boiler's water pressure", "user"));
        context.Todos.Add(new Entities.Todo("Shopping list", "Check the shopping list", "user"));
        context.Todos.Add(new Entities.Todo("Alarm clock", "Set the alarm clock", "user"));
        context.SaveChanges();
    }

    /// <summary>
    /// Setup Todos Update Trigger
    /// </summary>
    /// <param name="context"></param>
    private static void SetupUpdateTrigger(Context context)
    {
        // set Updated to trigger - this is a Kludge, but there doesn't appear to be an easy way to do this, needs more R&D
        string rawSql =
@"
CREATE TRIGGER trgAfterUpdateTodos ON dbo.Todos AFTER UPDATE  
AS BEGIN
   UPDATE dbo.Todos
   SET Updated = GETUTCDATE()
   FROM INSERTED i
   WHERE i.Id = Todos.Id
END
";
        context.Database.ExecuteSqlRaw(rawSql);
    }

    /// <summary>
    /// Setup Next Log Id Sequence
    /// </summary>
    /// <param name="context"></param>
    private static void SetupNextLogIdSequence(Context context)
    {
        string rawSql = "CREATE SEQUENCE dbo.NextLogId AS int START WITH 1 INCREMENT BY 1; ";
        context.Database.ExecuteSqlRaw(rawSql);
    }
}
