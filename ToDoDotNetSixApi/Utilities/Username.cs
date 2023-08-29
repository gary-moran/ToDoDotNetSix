/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Utilities
*  Date:      29 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Username
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  29 AUG 2023 GM          Created
************************************************************************/

namespace ToDoDotNetSixApi.Utilities;

public class Username
{
    /// <summary>
    /// Get Username from HTTP Context
    /// </summary>
    /// <param name="httpContext"></param>
    /// <returns>Username</returns>
    public static string GetUsername(HttpContext httpContext) => httpContext.User.Claims.FirstOrDefault(c => c.Type == "unique_name")?.Value ?? "";
}
