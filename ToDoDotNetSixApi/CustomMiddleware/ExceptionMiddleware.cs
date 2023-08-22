/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Custom Middleware
*  Date:      07 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Exception Middleware
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  07 JUL 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using ToDoDotNetSixApi.ViewModels;
using ToDoDotNetSixApi.ViewModels.General;

namespace ToDoDotNetSixApi.CustomMiddleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ControllerBase> _logger;
    private string _errorText = "Internal Server Error.";

    public ExceptionMiddleware(RequestDelegate next, ILogger<ControllerBase> logger)
    {
        _logger = logger;
        _next = next;
    }

    /// <summary>
    /// Middleware method to process HTTP Context
    /// </summary>
    /// <param name="httpContext"></param>
    /// <returns>Task</returns>
    /// <remarks>
    /// This code logs the error, then calls HandleExceptionAsync to handle the response asynchronously
    /// </remarks>
    public async Task InvokeAsync(HttpContext httpContext)
    {   
        try
        {
            await _next(httpContext);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            await HandleExceptionAsync(httpContext, ex, 409);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"{_errorText} : {ex.Message}");
            await HandleExceptionAsync(httpContext, ex);
        }
    }

    /// <summary>
    /// Method to handle the exception HTTP response
    /// </summary>
    /// <param name="httpContext"></param>
    /// <param name="exception"></param>
    /// <param name="statusCode"></param>
    /// <returns>HTTP Response</returns>
    private Task HandleExceptionAsync(HttpContext httpContext, Exception exception, int? statusCode = null)
    {
        string message = statusCode == null ? _errorText : exception.Message;
        httpContext.Response.ContentType = "application/json";
        httpContext.Response.StatusCode = statusCode ?? (int)HttpStatusCode.InternalServerError;
        return httpContext.Response.WriteAsync(new ErrorDetails()
        {
            StatusCode = httpContext.Response.StatusCode,
            Message = message
        }.ToString());
    }
}
