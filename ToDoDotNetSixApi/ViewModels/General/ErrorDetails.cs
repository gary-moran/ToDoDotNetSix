/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    View Models
*  Date:      07 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Error Details
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  07 JUL 2023 GM          Created
************************************************************************/

using Newtonsoft.Json;

namespace ToDoDotNetSixApi.ViewModels.General;

public class ErrorDetails
{
    public int StatusCode { get; set; }
    public string Message { get; set; }
    public override string ToString() => JsonConvert.SerializeObject(this);
}
