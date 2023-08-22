/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Controllers
*  Date:      21 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Extension base class
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  21 JUL 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Mvc;

namespace ToDoDotNetSixApi.Controllers.Base;

public abstract class ExtensionController : ControllerBase
{
    /// <summary>
    /// Handle the Response based on T result
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="result"></param>
    /// <param name="conflict">handle a null or false as a Conflict instead of a NotFound</param>
    /// <returns>Response as an ActionResult</returns>
    public ActionResult<T> HandleResponse<T>(T result, bool conflict = false)
    {
        // TODO: implement using Interface of Return Type Classes set by ENUM prop (State Machine pattern) e.g. OkNotFound : IReturnType

        Type type = typeof(T);

        if (type == typeof(bool))
        {
            if ((bool)Convert.ChangeType(result, typeof(bool))) // result == true
                return Ok(result);
            else
            {
                if (conflict)
                    return Conflict();
                else
                    return NotFound();
            }
        }
        else
        {
            if (result == null)
            {
                if (conflict)
                    return Conflict();
                else
                    return NotFound();
            }
            else
                return Ok(result);
        }
    }
}
