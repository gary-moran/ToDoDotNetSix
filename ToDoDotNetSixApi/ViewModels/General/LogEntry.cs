/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      17 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Log Entry model
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  17 AUG 2023 GM          Created
************************************************************************/

using System.ComponentModel.DataAnnotations;
using ToDoDotNetSixApi.Utilities;

namespace ToDoDotNetSixApi.ViewModels.General;

public class LogEntry
{
    public int LogId { get; set; }
    [RegularExpression(pattern: Whitelist.WhitelistDetails.DESC)]
    public string Message { get; set; }
    public object[] ExtraInfo { get; set; }
}
