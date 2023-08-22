/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      21 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Repository Interface
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
    public interface IRepo
    {
        Task<TEntity> Add<TEntity>(TEntity entity, Expression<Func<TEntity, bool>>? condition = null) where TEntity : class;
        Task<TModel> AddFromModel<TEntity, TModel>(TModel model, IMapper mapper, Expression<Func<TEntity, bool>>? condition = null)
            where TEntity : class
            where TModel : class;
        Task<int> Count<TEntity>(Expression<Func<TEntity, bool>> condition) where TEntity : class;
        Task<bool> Delete<TEntity>(Expression<Func<TEntity, bool>> condition) where TEntity : class;
        Task<bool> DeleteFrom<TEntity>(long id) where TEntity : class, IEntity;
        Task<bool> DeleteList<TEntity>(Expression<Func<TEntity, bool>> condition) where TEntity : class;
        void Dispose();
        Task<TEntity> Get<TEntity>(Expression<Func<TEntity, bool>> condition, bool tracking = true) where TEntity : class;
        Task<TEntity> Get<TEntity>(long id) where TEntity : class, IEntity;
        Task<List<TEntity>> GetList<TEntity>(Expression<Func<TEntity, bool>> condition, bool tracking = true) where TEntity : class;
        Task<List<TEntity>> GetListAll<TEntity>() where TEntity : class;
        Task<TEntity> Update<TEntity>(TEntity entity) where TEntity : class;
        Task<TModel> UpdateFromModel<TEntity, TModel>(TModel model, long id, IMapper mapper)
            where TEntity : class, IEntity
            where TModel : class;
    }
}