/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Classes
*  Date:      23 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Pending Changes
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  23 AUG 2023 GM          Created
************************************************************************/

import { HostListener, Inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { ComponentCanDeactivate } from "../guards/pending-changes.guard";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class PendingChanges implements ComponentCanDeactivate {

  private _pendingFormGroup: FormGroup | undefined;

  protected set pendingFormGroup(formGroup: FormGroup) {
    this._pendingFormGroup = formGroup;
  }

  constructor(@Inject(AuthenticationService) private pendingAuthenticationService: AuthenticationService | undefined = undefined) { }

  @HostListener('window:beforeunload')
  public canDeactivate(): boolean | Observable<boolean> {

    if (!this._pendingFormGroup)
      return true;
    if (this.pendingAuthenticationService && !this.pendingAuthenticationService.isAuthenticated())
      return true;
    else
      return this._pendingFormGroup.pristine;
  }
}
