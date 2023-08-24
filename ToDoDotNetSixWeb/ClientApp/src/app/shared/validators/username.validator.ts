/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Validators
*  Date:      16 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Username Validator
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  16 AUG 2023 GM          Created
************************************************************************/

import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Generic } from '../models/generic';
import { ViewModelDataService } from '../services/view-model-data.service';

@Injectable({ providedIn: 'root' })
export class UsernameValidator {

  static createValidator(viewModelDataService: ViewModelDataService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return viewModelDataService.actionViewModel<Generic, boolean>(new Generic(control.value), "account", "IsUsernameAvailable", false)
        .pipe(
          map(isAvailable => isAvailable ? null : { "usernameValidator-MSG": "This username is not available" }),
          catchError(() => of(null))
        );
    };
  }
}
