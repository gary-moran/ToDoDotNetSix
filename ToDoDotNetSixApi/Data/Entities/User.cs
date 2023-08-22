/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      08 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  User model
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  08 AUG 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Identity;
using ToDoDotNetSixApi.ViewModels.General;

namespace ToDoDotNetSixApi.Data.Entities;

public class User : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    public User() { }

    /// <summary>
    /// User constructor
    /// </summary>
    /// <param name="loginViewModel">Login View Model</param>
    public User(LoginViewModel loginViewModel)
    {
        Email = loginViewModel.Email;
        FirstName = loginViewModel.Firstname;
        LastName = loginViewModel.Lastname;
        UserName = loginViewModel.Username;
    }
}
