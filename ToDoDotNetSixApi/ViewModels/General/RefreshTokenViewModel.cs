/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      11 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Refresh Token model
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  11 AUG 2023 GM          Created
************************************************************************/

using System.ComponentModel.DataAnnotations;
using ToDoDotNetSixApi.Utilities;

namespace ToDoDotNetSixApi.ViewModels.General;

public class RefreshTokenViewModel
{
    [RegularExpression(pattern: Whitelist.WhitelistDetails.DESC)]
    public string UserId { get; set; }
    [RegularExpression(pattern: Whitelist.WhitelistDetails.DESC)]
    public string RefreshToken { get; set; }
    [RegularExpression(pattern: Whitelist.WhitelistDetails.DESC)]
    public string Token { get; set; }
}
