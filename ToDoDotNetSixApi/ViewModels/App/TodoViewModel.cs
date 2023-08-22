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

using System.ComponentModel.DataAnnotations;
using ToDoDotNetSixApi.Data.Repo;
using ToDoDotNetSixApi.Utilities;

namespace ToDoDotNetSixApi.ViewModels.App;

public class TodoViewModel : IEntity
{
    public long Id { get; set; }

    [RegularExpression(pattern: Whitelist.WhitelistDetails.DESC)]
    public string? Name { get; set; }

    [RegularExpression(pattern: Whitelist.WhitelistDetails.DESC)]
    public string? Description { get; set; }

    [Required]
    [RegularExpression(pattern: Whitelist.WhitelistDetails.DESC)]
    public string? Username { get; set; }

    public bool IsComplete { get; set; }

    public DateTime Updated { get; set; }
}
