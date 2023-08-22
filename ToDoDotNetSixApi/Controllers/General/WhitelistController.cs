/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Controllers
*  Date:      09 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Whitelist Controller
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  09 AUG 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ToDoDotNetSixApi.ActionFilters;
using ToDoDotNetSixApi.Utilities;
using ToDoDotNetSixApi.ViewModels.General;

namespace ToDoDotNetSixApi.Controllers.General;

[Route("api/[controller]")]
[ApiController]
public class WhitelistController : ControllerBase
{
    /// <summary>
    /// Get Whitelists
    /// </summary>
    /// <returns>Whitelists</returns>
    [HttpGet()]
    public async Task<ActionResult<IEnumerable<WhitelistViewModel>>> GetWhitelists() => Whitelist.GetWhitelists();

    /// <summary>
    /// Get Single WhiteList
    /// </summary>
    /// <returns>Whitelist</returns>
    [HttpPost("[action]")]
    [ServiceFilter(typeof(ValidateModelState))]
    public async Task<ActionResult<WhitelistViewModel>> GetWhitelist([FromBody] WhitelistViewModel searchType) => Whitelist.GetWhitelist(searchType.Type);
}
