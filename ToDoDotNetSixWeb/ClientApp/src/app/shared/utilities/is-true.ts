/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Utilities
*  Date:      11 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Is True
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  11 AUG 2023 GM          Created
************************************************************************/

import { isNullOrUndefined } from 'is-what';

export class IsTrue {
  /**
   * evaluate if value is true
   * @returns true or false
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static eval(value: any): boolean {
    return !isNullOrUndefined(value);
  }
}
