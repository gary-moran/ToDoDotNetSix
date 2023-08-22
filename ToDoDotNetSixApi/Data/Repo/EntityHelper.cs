/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      21 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Entity Helper class
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  21 JUL 2023 GM          Created
************************************************************************/

namespace ToDoDotNetSixApi.Data.Repo;

public static class EntityHelper
{
    /// <summary>
    /// Check the Id against the param, if the param is passed and Id is zero then update
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="id"></param>
    /// <returns>TEntity</returns>
    public static TEntity CheckId<TEntity>(TEntity entity, long? id) where TEntity : IEntity
    {
        if (id != null && entity.Id == 0)
            entity.Id = id.Value;

        return entity;
    }
}