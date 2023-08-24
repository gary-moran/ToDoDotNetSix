/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Todo
*  Date:      25 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Routing Module
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  25 JUL 2023 GM          Created
************************************************************************/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { PendingChangesGuard } from '../shared/guards/pending-changes.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
  { path: "todo", component: TodoComponent, canActivate: [AuthGuard], canDeactivate: [PendingChangesGuard] },
  { path: "login", component: LoginComponent, canDeactivate: [PendingChangesGuard] },
  { path: "register", component: RegisterComponent, canDeactivate: [PendingChangesGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule { }
