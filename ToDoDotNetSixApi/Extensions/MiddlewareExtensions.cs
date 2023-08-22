/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Extensions
*  Date:      07 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Middleware Extensions
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  07 JUL 2023 GM          Created
************************************************************************/

using ToDoDotNetSixApi.CustomMiddleware;

namespace ToDoDotNetSixApi.Extensions;

public static class MiddlewareExtensions
{
    public static void ConfigureCustomMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
    }
}
