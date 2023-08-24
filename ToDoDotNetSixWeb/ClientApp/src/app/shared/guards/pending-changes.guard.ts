/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Guards
*  Date:      23 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Pending Changes Guard
*  Notes:     https://stackoverflow.com/questions/35922071/warn-user-of-unsaved-changes-before-leaving-page
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  23 AUG 2023 GM          Created
************************************************************************/

import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { ModalDialogService } from '../services/modal-dialog.service';
import { ModalReturn, ModalType } from '../components/modal-dialog/modal-dialog.component';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor(private modalDialogService: ModalDialogService, ) { }

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {

    let checkDeactivate: boolean | Observable<boolean> = false;
    try { checkDeactivate = component?.canDeactivate() ?? true; } catch { checkDeactivate = true;  }

    return checkDeactivate ? true : from(this.confirm());

  }

  /**
   * Confirm Navigate Away
   * @returns true or false as a promise
   */
  async confirm(): Promise<boolean> {
    return await this.modalDialogService.callModalDialog(ModalType.OkCancel, "You have unsaved changes", "Press Cancel to go back and save these changes, or Ok to continue.") == ModalReturn.Ok;
  }
}
