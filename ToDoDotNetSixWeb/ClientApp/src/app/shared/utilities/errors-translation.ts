/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Utilities
*  Date:      04 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Errors Translation
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  04 AUG 2023 GM          Created
************************************************************************/

export class ErrorsTranslation {
  /**
   * Translate
   * @returns Translation
   */
  public static translate(errorString: string): string {

    let returnString: string = errorString;

    const translations: Map<string, string> = new Map(Object.entries(
      {
        "VALIDATION.REQUIRED": "This value is required",
        "INVALID_ADDRESS": "Only letters, numbers, spaces, apostrophes, commas, full stops and hyphens are allowed",
        "INVALID_ALPHA": "Only letters and spaces are allowed",
        "INVALID_ALPHANUM": "Only letters and numbers are allowed",
        "INVALID_DESCRIPTION": "Only letters, numbers, spaces, and punctuation (excluding dash, braces and ellipsis) are allowed",
        "INVALID_NAME": "Only letters, spaces and apostrophes are allowed",
        "INVALID_NUM": "Only numbers are allowed",
        "INVALID_NUMSYM": "Only numbers, decimal points, slashes, plusses and minuses are allowed",
        "INVALID_TEXT": "Only letters, numbers forward slash and spaces are allowed",
        "INVALID_FILENAME": "Only letters, numbers, spaces, apostrophes, full stops, hyphens, underscores and parentheses are allowed",
        "INVALID_USERNAME": "Only letters, numbers, underscores and hyphens are allowed for a username",
        "INVALID_PASSWORD": "Only letters, numbers, spaces, and punctuation (excluding dash, braces and ellipsis) are allowed for a password",
        "INVALID_EMAIL":"Invalid email address"
      }
    ))

    returnString = translations.get(errorString) ?? errorString; 

    return returnString; 
  }
}
