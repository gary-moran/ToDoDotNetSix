/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Utilities
*  Date:      02 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  GUID
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  02 AUG 2023 GM          Created
************************************************************************/

export class Guid {
  /**
   * Get GUID
   * @returns GUID
   */
  public static getGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
