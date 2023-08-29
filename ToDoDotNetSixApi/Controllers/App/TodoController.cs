/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Controllers
*  Date:      06 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Todo
*  Notes:     
*    Valid ActionResult return values:
*      Ok() => returns the 200 status code
*      NotFound() => returns the 404 status code
*      BadRequest() => returns the 400 status code
*      NoContent() => returns the 204 status code
*      Created(), CreatedAtRoute(), CreatedAtAction() => returns the 201 status code
*      Unauthorized() => returns the 401 status code
*      Forbid() => returns the 403 status code
*      StatusCode() => returns the status code we provide as input
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  06 JUL 2023 GM          Created
************************************************************************/

using ToDoDotNetSixApi.ActionFilters;
using Microsoft.AspNetCore.Mvc;
using ToDoDotNetSixApi.Data;
using AutoMapper;
using ToDoDotNetSixApi.Data.Entities;
using ToDoDotNetSixApi.Data.Repo;
using ToDoDotNetSixApi.Controllers.Base;
using ToDoDotNetSixApi.Behaviours.App;
using ToDoDotNetSixApi.ViewModels.App;
using ToDoDotNetSixApi.Utilities;

namespace ToDoDotNetSixApi.Controllers.App;

public class TodoController : AuthorizeController
{
    private readonly Context _context;
    private readonly TodoBehaviour _todoBehaviour;

    public TodoController(Context context, IMapper mapper)
    {
        _context = context;
        IEntityRepo<Todo> entityRepo = new EntityRepo<Todo>(context);
        _todoBehaviour = new TodoBehaviour(entityRepo, mapper);
    }

    // GET: api/Todo
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoViewModel>>> GetTodos() 
        => (await _todoBehaviour.GetTodosByUsername(Username.GetUsername(HttpContext))).ToList();

    // GET: api/Todo/5        
    [HttpGet("{id}")]
    [ServiceFilter(typeof(ValidateIdParam))]
    public async Task<ActionResult<TodoViewModel>> GetTodo(long id)
        => HandleResponse(await _todoBehaviour.GetTodo(id));

    // POST: api/Todo
    [HttpPost]
    [ServiceFilter(typeof(ValidateModelState))]
    public async Task<ActionResult<TodoViewModel>> AddTodo([FromBody] TodoViewModel todoModel)
        => HandleResponse(await _todoBehaviour.AddTodo(todoModel), conflict: true);

    // PUT: api/Todo/5
    [HttpPut("{id}")]
    [ServiceFilter(typeof(ValidateIdParam))]
    [ServiceFilter(typeof(ValidateIEntityState))]
    public async Task<ActionResult<TodoViewModel>> UpdateTodo(long id, [FromBody] TodoViewModel todoModel)
        => HandleResponse(await _todoBehaviour.UpdateTodo(todoModel, id));

    // DELETE: api/Todo/5
    [HttpDelete("{id}")]
    [ServiceFilter(typeof(ValidateIdParam))]
    public async Task<ActionResult<bool>> DeleteTodo(long id)
        => HandleResponse(await _todoBehaviour.DeleteTodo(id));
}