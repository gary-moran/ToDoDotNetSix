/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared
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
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './components/message/message.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { ElementValidationMessageComponent } from './components/element-validation-message/element-validation-message.component';
import { WhitelistValidatorDirective } from './directives/whitelist';

@NgModule({
  declarations: [
    MessageComponent,
    ModalDialogComponent,
    WhitelistValidatorDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ElementValidationMessageComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MessageComponent,
    ModalDialogComponent,
    ElementValidationMessageComponent,
    WhitelistValidatorDirective,
  ]
})
export class SharedModule { }
