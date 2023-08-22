/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      06 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Todo model
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  06 JUL 2023 GM          Created
************************************************************************/

using System.ComponentModel.DataAnnotations.Schema;
using ToDoDotNetSixApi.Data.Repo;

namespace ToDoDotNetSixApi.Data.Entities;

public class Todo: IEntity
{
    // default parameterless constructor
    public Todo() { }

    public Todo(string name, string description = "", string username = "", bool isComplete = false)
    {
        Name = name;
        Description = description;
        Username = username;
        IsComplete = isComplete;
    }

    public long Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public bool IsComplete { get; set; }

    public string Username { get; set; } = string.Empty;

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime Created { get; set; }

    public string CreatedBy { get; set; } = "ToDo System";

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime Updated { get; set; }

    public string UpdatedBy { get; set; } = "ToDo System";
}
