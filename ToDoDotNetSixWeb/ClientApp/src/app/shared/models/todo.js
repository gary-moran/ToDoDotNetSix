"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
var Todo = /** @class */ (function () {
    function Todo(todo) {
        var _a, _b, _c;
        if (todo) {
            this.id = (_a = todo.id) !== null && _a !== void 0 ? _a : undefined;
            this.name = todo.name;
            this.description = todo.description;
            this.isComplete = (_b = todo.isComplete) !== null && _b !== void 0 ? _b : false;
            this.updated = (_c = todo.updated) !== null && _c !== void 0 ? _c : undefined;
        }
        else {
            this.id = undefined;
            this.name = "";
            this.description = "";
            this.isComplete = false;
            this.updated = undefined;
        }
    }
    return Todo;
}());
exports.Todo = Todo;
//# sourceMappingURL=todo.js.map