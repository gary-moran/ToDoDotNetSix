/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      19 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Entity Repository
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  19 JUL 2023 GM          Created
************************************************************************/

using AutoMapper;
using System.Linq.Expressions;

namespace ToDoDotNetSixApi.Data.Repo;

public class EntityRepo<TEntity> : IEntityRepo<TEntity> where TEntity : class, IEntity
{
    Repo _repo;

    public EntityRepo(Context context) => _repo = new Repo(context);

    ~EntityRepo() => _repo.Dispose();

    /// <summary>
    /// Count the number of rows for a condition
    /// </summary>
    /// <param name="condition"></param>
    /// <returns>Number of rows</returns>
    public async Task<int> Count(Expression<Func<TEntity, bool>> condition) => await _repo.Count<TEntity>(condition);

    /// <summary>
    /// Get List - All
    /// </summary>
    /// <returns>List of All TEntity</returns>
    public async Task<List<TEntity>> GetListAll() => await _repo.GetListAll<TEntity>();

    /// <summary>
    /// Get List
    /// </summary>
    /// <param name="condition"></param>
    /// <param name="tracking">Use EF State Tracking - true by default</param>
    /// <returns>List of TEntity</returns>
    public async Task<List<TEntity>> GetList(Expression<Func<TEntity, bool>> condition, bool tracking) => await _repo.GetList<TEntity>(condition, tracking);

    /// <summary>
    /// Get Entity
    /// </summary>
    /// <param name="condition"></param>
    /// <param name="tracking">Use EF State Tracking - true by default</param>
    /// <returns>TEntity</returns>
    public async Task<TEntity> Get(long id) => await _repo.Get<TEntity>(id);

    /// <summary>
    /// Get Entity
    /// </summary>
    /// <param name="condition"></param>
    /// <param name="tracking">Use EF State Tracking - true by default</param>
    /// <returns>TEntity</returns>
    public async Task<TEntity> Get(Expression<Func<TEntity, bool>> condition, bool tracking = true) => await _repo.Get<TEntity>(condition, tracking);

    /// <summary>
    /// Add - without Transaction
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="condition"></param>
    /// <returns>TEntity</returns>
    public async Task<TEntity> Add(TEntity entity, Expression<Func<TEntity, bool>>? condition = null) => await _repo.Add<TEntity>(entity, condition);

    /// <summary>
    /// Add From Model - with Transaction
    /// </summary>
    /// <typeparam name="TModel"></typeparam>
    /// <param name="model"></param>
    /// <param name="mapper"></param>
    /// <param name="condition"></param>
    /// <returns>TModel</returns>
    public async Task<TModel> AddFromModel<TModel>(TModel model, IMapper mapper, Expression<Func<TEntity, bool>>? condition = null) where TModel : class
        => await _repo.AddFromModel<TEntity, TModel>(model, mapper, condition);

    /// <summary>
    /// Update - without transaction
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="condition"></param>
    /// <returns>TEntity</returns>
    public async Task<TEntity> Update(TEntity entity) => await _repo.Update<TEntity>(entity);

    /// <summary>
    /// Update From Model - with Transaction
    /// </summary>
    /// <typeparam name="TModel"></typeparam>
    /// <param name="model"></param>
    /// <param name="id"></param>
    /// <param name="mapper"></param>
    /// <returns>TModel</returns>
    public async Task<TModel> UpdateFromModel<TModel>(TModel model, long id, IMapper mapper) where TModel : class, IEntity
        => await _repo.UpdateFromModel<TEntity, TModel>(model, id, mapper);

    /// <summary>
    /// Delete List - without transaction
    /// </summary>
    /// <param name="condition"></param>
    /// <returns>true if found and deleted</returns>
    public async Task<bool> DeleteList(Expression<Func<TEntity, bool>> condition) => await _repo.DeleteList<TEntity>(condition);

    /// <summary>
    /// Delete - without transaction
    /// </summary>
    /// <param name="condition"></param>
    /// <returns>true if found and deleted</returns>
    public async Task<bool> Delete(Expression<Func<TEntity, bool>> condition) => await _repo.Delete<TEntity>(condition);

    /// <summary>
    /// Delete From - with Transaction
    /// </summary>
    /// <param name="id"></param>
    /// <returns>true if found and deleted</returns>
    public async Task<bool> DeleteFrom(long id) => await _repo.DeleteFrom<TEntity>(id);
}
