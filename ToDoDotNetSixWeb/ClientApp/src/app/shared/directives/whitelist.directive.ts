/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Directives
*  Date:      09 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Whitelist Validator Directive
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  09 AUG 2023 GM          Created
************************************************************************/

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { TextValidators } from '../validators/text.validator';
import { Whitelist } from '../models/whitelist';

@Directive({
  selector: '[whitelist]',
  providers: [{ provide: NG_VALIDATORS, useExisting: WhitelistValidatorDirective, multi: true }]
})
export class WhitelistValidatorDirective implements Validator {
  @Input('whitelist') whitelist: Whitelist = new Whitelist();

  /**
  * Validate
  * @param control Control
  */
  validate(control: AbstractControl): { [key: string]: any } {
    return TextValidators.whitelistValidatorFn(control, this.whitelist);
  }

}
