/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Models
*  Date:      25 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Todo model
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  25 JUL 2023 GM          Created
************************************************************************/

export class Todo {
  constructor(todo?: Todo) {
    if (todo) {
      this.id = todo.id ?? undefined;
      this.name = todo.name;
      this.description = todo.description;
      this.username = todo.username;
      this.isComplete = todo.isComplete ?? false;
      this.updated = todo.updated ?? undefined;
    } else {
      this.id = undefined;
      this.name = "";
      this.description = "";
      this.username = undefined;
      this.isComplete = false;
      this.updated = undefined;
    }
  }

  id?: number;
  name: string;
  description: string;
  username?: string;
  isComplete: boolean;
  updated?: Date;
}
