/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Validators
*  Date:      09 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Text Validators
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  09 AUG 2023 GM          Created
************************************************************************/

/* eslint-disable @typescript-eslint/no-explicit-any */

import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Whitelist } from '../models/whitelist';

export class TextValidators {

  /**
  * Minimum Length Validator
  * @param length
  */
  static minLengthValidator(length: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => TextValidators.minLengthValidatorFn(control, length);
  }

  /**
  * Minimum Length Validator Function
  * @param control Control
  * @param length
  */
  static minLengthValidatorFn(control: AbstractControl, length: number): { [key: string]: any } {

    let errors: any = null;

    // Validate input    
    if (control.value !== null) {
      if (control.value !== undefined) {
        if (control.value != "") {
          if (!this.validateMinLength(control.value.toString(), length)) {
            errors = { "minLengthValidator-MSG": `A minimum of ${length} characters is required` };
          }
        }
      }
    }

    return errors;
  }

  /**
   * Validate Minimum Length
   * @param value
   * @param length
   */
  private static validateMinLength(value: string, length: number): boolean {

    return value.length >= length;

  }

  /**
  * Match Validator
  * @param inputName
  * @param matchInputName
  * @param isPassword
  */
  static matchValidator(inputName: string, matchInputName: string, isPassword: boolean = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => TextValidators.matchValidatorFn(control, inputName, matchInputName, isPassword);
  }

  /**
  * Match Validator Function
  * @param control Control
  * @param inputName
  * @param matchInputName
  * @param isPassword
  */
  static matchValidatorFn(control: AbstractControl, inputName: string, matchInputName: string, isPassword: boolean = false): { [key: string]: any } {

    let errors: any = null;
    const errorMessage = isPassword ? "Passwords do not match" : "Values do not match";

    const inputControl: AbstractControl | undefined = control?.get(inputName) ?? undefined;
    const matchControl: AbstractControl | undefined = control?.get(matchInputName) ?? undefined;

    // Validate input    
    if (inputControl && matchControl) {
      if (inputControl.value != "" && matchControl.value != "") {
        if (!this.validateMatch(inputControl.value.toString(), matchControl.value.toString())) {
          errors = { "matchValidator-MSG": errorMessage };
        }
      }
    }

    return errors;
  }

  /**
   * Validate Matching Values
   * @param value
   * @param match
   */
  private static validateMatch(value: string, match: string): boolean {

    return value === match;

  }

  /**
  * Email Validator
  */
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => TextValidators.emailValidatorFn(control);
  }

  /**
  * Email Validator Function
  * @param control
  */
  static emailValidatorFn(control: AbstractControl): { [key: string]: any } {

    let errors: any = null;
    // Validate input    
    if (control.value !== null) {
      if (control.value !== undefined) {
        if (control.value != "") {
          if (!this.validateEmail(control.value)) {
            errors = { "emailValidator-MSG": "INVALID_EMAIL" };
          }
        }
      }
    }

    return errors;
  }

  /**
   * Validate Email
   * @param email
   */
  static validateEmail(email: string): boolean {

    /*
     * for discussions on email regex expressions see: https://www.regular-expressions.info/email.html
     */
    const regex = /^[A-Z0-9][A-Z0-9._%+-]{0,63}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/igm;
    if (email.match(regex))
      return true;
    else
      return false;
  }

  /**
  * Whitelist Validator
  * @param whitelist
  */
  static whitelistValidator(whitelist: Whitelist): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => TextValidators.whitelistValidatorFn(control, whitelist);
  }

  /**
  * Whitelist Validator Function
  * @param control
  * @param whitelist
  */
  static whitelistValidatorFn(control: AbstractControl, whitelist: Whitelist): { [key: string]: any } {

    let errors: any = null;

    // Validate input    
    if (control.value !== null) {
      if (control.value !== undefined) {
        if (control.value != "") {
          if (!this.validateWhitelist(control.value.toString(), whitelist)) {
            errors = { "whitelistValidator-MSG": whitelist.error };
          }
        }
      }
    }

    return errors;
  }

  /**
   * Validate Whitelist
   * @param value
   * @param whitelist
   */
  private static validateWhitelist(value: string, whitelist: Whitelist): boolean {

    const regex = new RegExp(whitelist.pattern);    
    if (value.match(regex))
      return true;
    else
      return false;
  }
}
