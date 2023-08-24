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

  formGroup: FormGroup | undefined;

  protected set pendingFormGroup(formGroup: FormGroup) {
    this.formGroup = formGroup;
  }

  constructor(@Inject(AuthenticationService) private authService: AuthenticationService | undefined = undefined) { }

  @HostListener('window:beforeunload')
  public canDeactivate(): boolean | Observable<boolean> {

    if (!this.formGroup)
      return true;
    if (this.authService && !this.authService.isAuthenticated())
      return true;
    else
      return this.formGroup.pristine;
  }
}
