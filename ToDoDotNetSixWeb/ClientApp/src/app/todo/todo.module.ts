/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Todo
*  Date:      25 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Module
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  25 JUL 2023 GM          Created
************************************************************************/

import { NgModule } from '@angular/core';
import { TodoRoutingModule } from './todo-routing.module';
import { TodoComponent } from './todo/todo.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    TodoComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    SharedModule,
    TodoRoutingModule
  ]
})
export class TodoModule { }
