/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Extensions
*  Date:      07 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Context Extensions
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  07 JUL 2023 GM          Created
************************************************************************/

using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Reflection;

namespace ToDoDotNetSixApi.Extensions;

public enum ContextSequence
{
    [Description("NextLogId")] LogId
}

public static class ContextExtensions
{
    /// <summary>
    /// Reset Concurrency Token
    /// </summary>
    /// <param name="context"></param>
    /// <param name="entity"></param>
    /// <remarks>https://stackoverflow.com/a/57317436</remarks>
    public static void ResetConcurrencyToken(this DbContext context, Object entity)
    {
        var lEntry = context.Entry(entity);
        foreach (var lProperty in lEntry.Metadata.GetProperties().Where(x => x.IsConcurrencyToken))
        {
            lEntry.OriginalValues[lProperty] = lEntry.CurrentValues[lProperty];
        }
    }

    /// <summary>
    /// Next Value For Sequence
    /// </summary>
    /// <param name="context"></param>
    /// <param name="contextSequence"></param>
    /// <returns>Sequence Value</returns>
    /// <remarks>
    /// https://stackoverflow.com/a/57211851
    /// </remarks>
    public static long NextValueForSequence(this DbContext context, ContextSequence contextSequence)
    {
        SqlParameter result = new SqlParameter("@result", System.Data.SqlDbType.BigInt)
        {
            Direction = System.Data.ParameterDirection.Output
        };

        var sequenceIdentifier = contextSequence.GetType()
                    ?.GetMember(contextSequence.ToString())
                    ?.First()
                    ?.GetCustomAttribute<DescriptionAttribute>()
                    ?.Description;

        context.Database.ExecuteSqlRaw($"SELECT @result = (NEXT VALUE FOR [{sequenceIdentifier}]);", result);

        return (long)result.Value;
    }
}