/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      16 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Generic view model
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  16 AUG 2023 GM          Created
************************************************************************/

using System.ComponentModel.DataAnnotations;
using ToDoDotNetSixApi.Utilities;

namespace ToDoDotNetSixApi.ViewModels.General;

public class GenericViewModel
{
    [Required]
    [RegularExpression(pattern: Whitelist.WhitelistDetails.DESC)]
    public string Value { get; set; }

    public GenericViewModel(string value) => Value = value;
}
