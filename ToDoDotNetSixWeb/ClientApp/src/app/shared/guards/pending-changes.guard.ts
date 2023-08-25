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

import { CanDeactivateFn, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { ModalDialogService } from '../services/modal-dialog.service';
import { ModalReturn, ModalType } from '../components/modal-dialog/modal-dialog.component';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export const PendingChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = (component: ComponentCanDeactivate): boolean | Observable<boolean | UrlTree> => {

  return component.canDeactivate() ? true : from(dialogConfirm());

};

/**
 * Confirm Navigate Away
 * @returns true or false as a promise
 */
export async function dialogConfirm(): Promise<boolean> {

  const modalDialogService: ModalDialogService = inject(ModalDialogService);
  return await modalDialogService.callModalDialog(ModalType.OkCancel, "You have unsaved changes", "Press Cancel to go back and save these changes, or Ok to continue.") == ModalReturn.Ok;
}
