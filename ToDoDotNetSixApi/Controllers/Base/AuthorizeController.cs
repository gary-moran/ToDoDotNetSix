/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Controllers
*  Date:      08 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  API Controller base class
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  08 AUG 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ToDoDotNetSixApi.Controllers.Base;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Route("api/[controller]")]
[ApiController]
public class AuthorizeController : ExtensionController { }
