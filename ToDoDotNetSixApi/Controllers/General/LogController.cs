/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Controllers
*  Date:      17 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Log Controller
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  17 AUG 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Mvc;
using ToDoDotNetSixApi.ActionFilters;
using ToDoDotNetSixApi.Data;
using ToDoDotNetSixApi.Extensions;
using ToDoDotNetSixApi.ViewModels.General;

namespace ToDoDotNetSixApi.Controllers.Log;

[Route("api/[controller]")]
[ApiController]
public class LogController : ControllerBase
{
    private readonly Context _context;
    protected readonly ILogger<LogController> _logger;

    public LogController(ILogger<LogController> logger, Context context)
    {
        _context = context;
        this._logger = logger;
    }

    [HttpGet()]
    public async Task<ActionResult<long>> GetVNextLogId()
    {
        return _context.NextValueForSequence(ContextSequence.LogId);
    }

    /// <summary>
    /// Post an error to be logged
    /// </summary>
    /// <returns></returns>
    [HttpPost()]
    [ServiceFilter(typeof(ValidateModelState))]
    public async Task<ActionResult<LogEntry>> AddLog([FromBody] LogEntry logEntry)
    {
        string logMessage = $"Client Error Log: ID: {logEntry.LogId}, Message: {logEntry.Message}";
        _logger.LogError(logMessage, logEntry.ExtraInfo);
        return Ok(logEntry);
    }
}