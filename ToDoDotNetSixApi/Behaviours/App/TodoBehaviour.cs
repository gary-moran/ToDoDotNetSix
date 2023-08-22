/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Behaviours
*  Date:      20 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Todo Behaviour
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  20 JUL 2023 GM          Created
************************************************************************/

using AutoMapper;
using ToDoDotNetSixApi.Data.Entities;
using ToDoDotNetSixApi.Data.Repo;
using ToDoDotNetSixApi.ViewModels.App;

namespace ToDoDotNetSixApi.Behaviours.App;

public class TodoBehaviour
{
    private readonly IEntityRepo<Todo> _entityRepo;
    private readonly IMapper _mapper;

    public TodoBehaviour(IEntityRepo<Todo> entityRepo, IMapper mapper)
    {
        _mapper = mapper;
        _entityRepo = entityRepo;
    }

    /// <summary>
    /// Get All Todos as View Models
    /// </summary>
    /// <returns>Todos</returns>
    public async Task<IEnumerable<TodoViewModel>> GetAllTodos()
        => _mapper.Map<Todo[], TodoViewModel[]>((await _entityRepo.GetListAll()).ToArray());

    /// <summary>
    /// Get a Todo View Model
    /// </summary>
    /// <param name="id"></param>
    /// <returns>Todo View Model</returns>
    public async Task<TodoViewModel> GetTodo(long id)
        => _mapper.Map<Todo, TodoViewModel>(await _entityRepo.Get(id));

    /// <summary>
    /// Get Todos by Username
    /// </summary>
    /// <param name="username"></param>
    /// <returns>Todos</returns>
    public async Task<IEnumerable<TodoViewModel>> GetTodosByUsername(string username)
        => _mapper.Map<Todo[], TodoViewModel[]>((await _entityRepo.GetList(t => t.Username == username, false)).ToArray());

    /// <summary>
    /// Add a Todo from a View Model
    /// </summary>
    /// <param name="model"></param>
    /// <returns>Todo View Model</returns>
    public async Task<TodoViewModel> AddTodo(TodoViewModel model)
        => await _entityRepo.AddFromModel(model, _mapper);

    /// <summary>
    /// Update a Todo from a View Model
    /// </summary>
    /// <param name="model"></param>
    /// <param name="id"></param>
    /// <returns>Todo View Model</returns>
    public async Task<TodoViewModel> UpdateTodo(TodoViewModel model, long? id = null)
        => await _entityRepo.UpdateFromModel(EntityHelper.CheckId(model, id), model.Id, _mapper);

    /// <summary>
    /// Delete a Todo
    /// </summary>
    /// <param name="id"></param>
    /// <returns>True if deleted</returns>
    public async Task<bool> DeleteTodo(long id)
        => await _entityRepo.DeleteFrom(id);
}