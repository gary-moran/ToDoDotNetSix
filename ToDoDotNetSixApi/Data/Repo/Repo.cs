/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      19 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Repository
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  19 JUL 2023 GM          Created
************************************************************************/

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using ToDoDotNetSixApi.Extensions;

namespace ToDoDotNetSixApi.Data.Repo;

public class Repo : IDisposable, IRepo
{
    // To detect redundant calls
    private bool _disposedValue;

    private readonly Context _context;

    public Repo(Context context) => _context = context;

    /// <summary>
    /// Count the number of rows for a condition
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="condition"></param>
    /// <returns>Number of rows</returns>
    public async Task<int> Count<TEntity>(Expression<Func<TEntity, bool>> condition) where TEntity : class
    {
        IQueryable<TEntity> query = _context.Set<TEntity>();
        query = query.Where(condition).AsQueryable();
        return await query.CountAsync();
    }

    /// <summary>
    /// Get List - All
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <returns>List of All TEntity</returns>
    public async Task<List<TEntity>> GetListAll<TEntity>() where TEntity : class
        => await _context.Set<TEntity>().AsNoTracking().ToListAsync();

    /// <summary>
    /// Get List
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="condition"></param>
    /// <param name="tracking">Use EF State Tracking - true by default</param>
    /// <returns>List of TEntity</returns>
    public async Task<List<TEntity>> GetList<TEntity>(Expression<Func<TEntity, bool>> condition, bool tracking = true) where TEntity : class
    {
        if (tracking)
            return await _context.Set<TEntity>().Where(condition).ToListAsync();
        else
            return await _context.Set<TEntity>().Where(condition).AsNoTracking().ToListAsync();
    }

    /// <summary>
    /// Get Entity
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="condition"></param>
    /// <param name="tracking">Use EF State Tracking - true by default</param>
    /// <returns>TEntity</returns>
    public async Task<TEntity> Get<TEntity>(long id) where TEntity : class, IEntity => await _context.Set<TEntity>().FindAsync(id);

    /// <summary>
    /// Get Entity
    /// </summary>.
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="condition"></param>
    /// <param name="tracking">Use EF State Tracking - true by default</param>
    /// <returns>TEntity</returns>
    public async Task<TEntity> Get<TEntity>(Expression<Func<TEntity, bool>> condition, bool tracking = true) where TEntity : class
    {
        if (tracking)
            return (await GetList<TEntity>(condition)).FirstOrDefault();
        else
            return (await GetList<TEntity>(condition, tracking: false)).FirstOrDefault();
    }

    /// <summary>
    /// Add - without Transaction
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="entity"></param>
    /// <param name="condition"></param>
    /// <returns>TEntity</returns>
    public async Task<TEntity> Add<TEntity>(TEntity entity, Expression<Func<TEntity, bool>>? condition = null) where TEntity : class
    {
        // check entity does not already exist
        if (condition != null)
        {
            if (await Get<TEntity>(condition) != null)
                return null;
        }

        // add entity
        entity = _context.Set<TEntity>().Add(entity).Entity;
        await _context.SaveChangesAsync();

        return entity;
    }

    /// <summary>
    /// Add From Model - with Transaction
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <typeparam name="TModel"></typeparam>		
    /// <param name="model"></param>
    /// <param name="mapper"></param>
    /// <param name="condition"></param>
    /// <returns>TModel</returns>
    public async Task<TModel> AddFromModel<TEntity, TModel>(TModel model, IMapper mapper, Expression<Func<TEntity, bool>>? condition = null) where TEntity : class where TModel : class
    {
        // check entity does not already exist
        if (condition != null)
        {
            if (await Get<TEntity>(condition) != null)
                return null;
        }

        // create entity
        TEntity entity = mapper.Map<TModel, TEntity>(model);

        // start transaction
        using (var dbContextTransaction = _context.Database.BeginTransaction())
        {
            // add entity
            entity = _context.Set<TEntity>().Add(entity).Entity;

            // commit transaction
            await _context.SaveChangesAsync();
            await dbContextTransaction.CommitAsync();
        }

        return mapper.Map<TEntity, TModel>(entity);
    }

    /// <summary>
    /// Update - without transaction
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="entity"></param>
    /// <returns>TEntity</returns>
    public async Task<TEntity> Update<TEntity>(TEntity entity) where TEntity : class
    {
        // Update
        _context.Entry(entity).CurrentValues.SetValues(entity);
        await _context.SaveChangesAsync();

        // reload the entity model
        await _context.Entry<TEntity>(entity).ReloadAsync();

        return entity;
    }

    /// <summary>
    /// Update From Model - with Transaction
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <typeparam name="TModel"></typeparam>
    /// <param name="model"></param>
    /// <param name="id"></param>
    /// <param name="mapper"></param>
    /// <returns>TModel</returns>
    public async Task<TModel> UpdateFromModel<TEntity, TModel>(TModel model, long id, IMapper mapper) where TEntity : class, IEntity where TModel : class
    {
        // retrieve entity
        TEntity entity = await Get<TEntity>(id);
        if (entity == null)
            return null;

        // merge view model with entity model
        mapper.Map<TModel, TEntity>(model, entity);

        // save, start transaction
        using (var dbContextTransaction = _context.Database.BeginTransaction())
        {
            _context.ResetConcurrencyToken(entity); // so concurrency check is on view model token, not retrieved token

            // commit transaction
            await _context.SaveChangesAsync();
            await dbContextTransaction.CommitAsync();

            // reload the entity model
            await _context.Entry<TEntity>(entity).ReloadAsync();
        }

        return mapper.Map<TEntity, TModel>(entity);
    }

    /// <summary>
    /// Delete List - without transaction
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="condition"></param>
    /// <returns>true if found and deleted</returns>
    public async Task<bool> DeleteList<TEntity>(Expression<Func<TEntity, bool>> condition) where TEntity : class
    {
        // retrieve entities to delete
        var rows = await GetList<TEntity>(condition);
        if (rows == null)
            return false;

        // Delete
        _context.Set<TEntity>().RemoveRange(rows);
        await _context.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// Delete - without transaction
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="condition"></param>
    /// <returns>true if found and deleted</returns>
    public async Task<bool> Delete<TEntity>(Expression<Func<TEntity, bool>> condition) where TEntity : class
    {
        // retrieve entity to delete
        TEntity entity = await Get<TEntity>(condition);
        if (entity == null)
            return false;

        // Delete
        _context.Set<TEntity>().Remove(entity);
        await _context.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// Delete From - with Transaction
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="id"></param>
    /// <returns>true if found and deleted</returns>
    public async Task<bool> DeleteFrom<TEntity>(long id) where TEntity : class, IEntity
    {
        // retrieve entity to delete
        TEntity entity = await Get<TEntity>(id);
        if (entity == null)
            return false;

        // delete, start transaction
        using (var dbContextTransaction = _context.Database.BeginTransaction())
        {
            _context.Set<TEntity>().Remove(entity);

            // commit transaction
            await _context.SaveChangesAsync();
            await dbContextTransaction.CommitAsync();
        }

        return true;
    }

    #region Dispose
    // Public implementation of Dispose pattern callable by consumers.
    public void Dispose() => Dispose(true);

    // Protected implementation of Dispose pattern.
    protected virtual void Dispose(bool disposing)
    {
        if (!_disposedValue)
        {
            if (disposing)
            {
                if (_context != null)
                    _context.Dispose();
            }

            _disposedValue = true;
        }
    }
    #endregion
}