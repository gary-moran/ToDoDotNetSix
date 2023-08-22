/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    View Models
*  Date:      07 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Whitelist
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  07 JUL 2023 GM          Created
************************************************************************/

using System.ComponentModel.DataAnnotations;
using ToDoDotNetSixApi.Utilities;

namespace ToDoDotNetSixApi.ViewModels.General;

public class WhitelistViewModel
{
    public string Type { get; set; }

    public string Pattern { get; set; }

    public string Error { get; set; }
}
