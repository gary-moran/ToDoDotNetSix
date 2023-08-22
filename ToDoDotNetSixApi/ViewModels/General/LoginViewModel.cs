/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      08 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Login model
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  08 AUG 2023 GM          Created
************************************************************************/

using System.ComponentModel.DataAnnotations;
using ToDoDotNetSixApi.Utilities;

namespace ToDoDotNetSixApi.ViewModels.General;

public class LoginViewModel
{
    [Required]
    [RegularExpression(pattern: Whitelist.WhitelistDetails.USERNAME)]
    public string Username { get; set; }

    [Required]
    [RegularExpression(pattern: Whitelist.WhitelistDetails.PASSWORD)]
    public string Password { get; set; }

    [RegularExpression(pattern: Whitelist.WhitelistDetails.DESC)]
    public string Email { get; set; }

    [RegularExpression(pattern: Whitelist.WhitelistDetails.NAME)]
    public string Firstname { get; set; }

    [RegularExpression(pattern: Whitelist.WhitelistDetails.NAME)]
    public string Lastname { get; set; }
}
