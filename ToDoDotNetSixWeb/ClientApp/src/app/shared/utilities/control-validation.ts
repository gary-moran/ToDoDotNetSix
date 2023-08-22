/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Utilities
*  Date:      04 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Control Validation
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  04 AUG 2023 GM          Created
************************************************************************/

import { AbstractControl } from "@angular/forms";

export class ControlValidation {
/**
 * Is Invalid
 * @param formControl
 * @returns true
 */
  public static isInvalid(formControl: AbstractControl | null): boolean {

    if (formControl == null)
      return false;
    else
        return formControl.invalid && (formControl.dirty || formControl.touched)
  }

}
