/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    ActionFilters
*  Date:      07 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  ValidateActionFilters
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  07 JUL 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ToDoDotNetSixApi.Data;
using ToDoDotNetSixApi.Data.Repo;

namespace ToDoDotNetSixApi.ActionFilters;

/// <summary>
/// Action Filter class to validate an Id param is passed to a controller
/// </summary>
public class ValidateIdParam : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        long id;
        if (ActionFilterHelper.ExitIfNoIdParam(ref context, out id))
            return;

        var resultContext = await next();
    }
}

/// <summary>
/// Action Filter class to validate the model passed to a controller
/// </summary>
public class ValidateModelState : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (ActionFilterHelper.ExitOnInvalidModelState(ref context))
            return;

        var resultContext = await next();
    }
}

/// <summary>
/// Action Filter class to validate an IEntity model passed to a controller
/// </summary>
public class ValidateIEntityState : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (ActionFilterHelper.ExitOnInvalidIEntityState(ref context))
            return;

        var resultContext = await next();
    }
}

/// <summary>
/// Action Filter class to validate an entity exists for an ID passed to a controller
/// </summary>
public class ValidateEntityExists<T> : IAsyncActionFilter where T : class, IEntity
{
    private readonly Context _dbContext;

    public ValidateEntityExists(Context context)
    {
        _dbContext = context;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        long id;
        if (ActionFilterHelper.ExitIfEntityDoesNotExists<T>(ref context, _dbContext, out id))
            return;

        var resultContext = await next();
    }
}

/// <summary>
/// Action Filter class to validate that an entity exists and its model is valid
/// </summary>
public class ValidateEntityExistsModelValid<T1> : IAsyncActionFilter where T1 : class, IEntity
{
    private readonly Context _dbContext;

    public ValidateEntityExistsModelValid(Context context)
    {
        _dbContext = context;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        long id;

        if (ActionFilterHelper.ExitIfEntityDoesNotExists<T1>(ref context, _dbContext, out id))
            return;
        if (ActionFilterHelper.ExitOnInvalidIEntityState(ref context, id))
            return;

        var resultContext = await next();

        return;
    }

    public bool EntityExists<T2>(long id) where T2 : class, IEntity => _dbContext.Set<T2>().SingleOrDefault(ent => ent.Id.Equals(id)) != null;
}

/// <summary>
/// Action Filter helper class - contains static methods used by multiple action filters
/// </summary>
public static class ActionFilterHelper
{
    /// <summary>
    /// Get Id from Context
    /// </summary>
    /// <param name="context">Action Executing Context</param>
    /// <returns>Id</returns>
    public static long? GetId(ref ActionExecutingContext context)
    {
        long? id = null;

        // get the Entity ID
        if (context.ActionArguments.ContainsKey("id"))
        {
            object entityId = context.ActionArguments["id"];
            if (entityId.GetType() == typeof(long) && (long)entityId != 0)
                id = (long)entityId;
        }

        return id;
    }

    /// <summary>
    /// Checks if a model state is valid and returns a boolean based on that
    /// </summary>
    /// <param name="context">Action Executing Context</param>
    /// <returns>true if the action filter should exit</returns>
    public static bool ExitOnInvalidModelState(ref ActionExecutingContext context)
    {
        // if the model state is invalid then bad request
        if (!context.ModelState.IsValid)
        {
            context.Result = new BadRequestObjectResult(context.ModelState);
            return true;
        }

        return false;
    }

    /// <summary>
    /// Checks if an IEntity model is valid and returns a boolean based on that
    /// </summary>
    /// <param name="context">Action Executing Context</param>
    /// <param name="id">Entity ID</param>
    /// <returns>true if the action filter should exit</returns>
    public static bool ExitOnInvalidIEntityState(ref ActionExecutingContext context, long? id = null)
    {
        var parameter = context.ActionArguments.SingleOrDefault(param => param.Value is IEntity);

        // if the model is empty then bad request
        if (parameter.Value == null)
        {
            context.Result = new BadRequestObjectResult("Object is null");
            return true;
        }

        // if the model state is invalid then bad request
        if (ExitOnInvalidModelState(ref context))
            return true;

        // if an ID is passed then check the passed ID matches that in the model, if not then bad request
        if (id == null)
            id = GetId(ref context);
        if (id != null)
        {
            IEntity entity = (IEntity)parameter.Value;
            if (entity.Id != 0 && !entity.Id.Equals(id))
            {
                context.Result = new BadRequestResult();
                return true;
            }
        }

        return false;
    }

    /// <summary>
    /// Checks if an Id param is passed
    /// </summary>
    /// <param name="context">Action Executing Context</param>
    /// <param name="id">Entity ID</param>
    /// <returns>true if the action filter should exit</returns>
    public static bool ExitIfNoIdParam(ref ActionExecutingContext context, out long id)
    {
        id = 0;
        long? entityId = GetId(ref context);

        // if we can't get an Id that's a bad request
        if (entityId == null)
        {
            context.Result = new BadRequestObjectResult("Bad Id parameter");
            return true;
        }

        id = entityId.Value;
        return false;
    }

    /// <summary>
    /// Checks if an Entity exists and returns a boolean based on that
    /// </summary>
    /// <typeparam name="T">Type</typeparam>
    /// <param name="context">Action Executing Context</param>
    /// <param name="dbContext">DB Context</param>
    /// <param name="id">Entity ID</param>
    /// <returns>true if the action filter should exit</returns>
    public static bool ExitIfEntityDoesNotExists<T>(ref ActionExecutingContext context, Context dbContext, out long id) where T : class, IEntity
    {
        long entityId;

        if (ExitIfNoIdParam(ref context, out id))
            return true;
        else
            entityId = id;

        // extract the entity            
        var entity = dbContext.Set<T>().SingleOrDefault(ent => ent.Id == entityId);

        // if we can't thats a Not Found status
        if (entity == null)
        {
            context.Result = new NotFoundResult();
            return true;
        }
        // if we can, then save that Entity so we can use it in the controller action
        else
            context.HttpContext.Items.Add("entity", entity);

        return false;
    }
}