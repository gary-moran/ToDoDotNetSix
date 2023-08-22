/* eslint-disable @typescript-eslint/no-explicit-any */
/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Utilities
*  Date:      04 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Element Focus
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  04 AUG 2023 GM          Created
************************************************************************/

import { isNullOrUndefined } from 'is-what';

export class ElementFocus {
  /**
   * Set Focus on Element
   * @param elementId Element ID
   * @param index index
   */
  public static setFocusOnElement(elementId: string, index?: number): void {
    // TODO: this should work but doesn't ???
    //elementId = isNullOrUndefined(index) ? elementId : `${elementId}-${index}`;
    //let element = document.getElementById(elementId);
    //this.setElementFocus(element);

    setTimeout(() => {
      elementId = isNullOrUndefined(index) ? elementId : `${elementId}-${index}`;
      const element = document.getElementById(elementId);
      if (element)
        element.focus();
    }, 200);
  }

  /**
   * Set Element Focus
   * @param element Element
   */
  public static setElementFocus(element: HTMLElement): void {
    setTimeout(() => {
      if (document.body.contains(element))
        element.focus();
    }, 200);
  }

  /**
   * Element Has Focus
   * @param elementId Element Id
   * @param index Index
   */
  public static elementHasFocus(elementId: string, index?: number) {
    elementId = isNullOrUndefined(index) ? elementId : `${elementId}-${index}`;
    const element = document.getElementById(elementId);
    return element == document.activeElement;
  }
}
