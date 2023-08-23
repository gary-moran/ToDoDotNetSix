/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Directives
*  Date:      23 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Pending Changes Directive
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  23 AUG 2023 GM          Created
************************************************************************/

import { Directive, HostListener } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { ComponentCanDeactivate } from "../guards/pending-changes.guard";

@Directive({
  selector: 'pending-changes',
})
export class PendingChanges implements ComponentCanDeactivate {

  formGroup: FormGroup | undefined;

  protected set pendingFormGroup(formGroup: FormGroup) {
    this.formGroup = formGroup;
  }

  @HostListener('window:beforeunload')
  public canDeactivate(): boolean | Observable<boolean> {
    if (!this.formGroup)
      return true;
    else
      return this.formGroup.pristine;
  }

}
