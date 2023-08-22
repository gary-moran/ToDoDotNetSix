/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      21 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Entity Repository Interface
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  21 JUL 2023 GM          Created
************************************************************************/

using AutoMapper;
using System.Linq.Expressions;

namespace ToDoDotNetSixApi.Data.Repo
{
    public interface IEntityRepo<TEntity> where TEntity : class, IEntity
    {
        Task<TEntity> Add(TEntity entity, Expression<Func<TEntity, bool>>? condition = null);
        Task<TModel> AddFromModel<TModel>(TModel model, IMapper mapper, Expression<Func<TEntity, bool>>? condition = null) where TModel : class;
        Task<int> Count(Expression<Func<TEntity, bool>> condition);
        Task<bool> Delete(Expression<Func<TEntity, bool>> condition);
        Task<bool> DeleteFrom(long id);
        Task<bool> DeleteList(Expression<Func<TEntity, bool>> condition);
        Task<TEntity> Get(Expression<Func<TEntity, bool>> condition, bool tracking = true);
        Task<TEntity> Get(long id);
        Task<List<TEntity>> GetList(Expression<Func<TEntity, bool>> condition, bool tracking);
        Task<List<TEntity>> GetListAll();
        Task<TEntity> Update(TEntity entity);
        Task<TModel> UpdateFromModel<TModel>(TModel model, long id, IMapper mapper) where TModel : class, IEntity;
    }
}