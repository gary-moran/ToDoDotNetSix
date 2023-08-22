/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Controllers
*  Date:      08 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Account Controller
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  08 AUG 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json;
using ToDoDotNetSixApi.ActionFilters;
using ToDoDotNetSixApi.Behaviours.General;
using ToDoDotNetSixApi.Data;
using ToDoDotNetSixApi.Data.Entities;
using ToDoDotNetSixApi.ViewModels.General;
using static ToDoDotNetSixApi.Behaviours.General.AccountBehaviour;

namespace ToDoDotNetSixApi.Controllers.General;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _config;
    private readonly Context _context;
    private readonly AccountBehaviour _accountBehaviour;

    public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration config, Context context)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _config = config;
        _context = context;
        _accountBehaviour = new AccountBehaviour(_userManager, _signInManager, _config, _context);
    }

    /// <summary>
    /// Creates a JWT Bearer Token for a valid user
    /// </summary>
    /// <param name="loginModel"></param>
    /// <returns>JWT Bearer Token</returns>
    [HttpPost("[action]")]
    [ServiceFilter(typeof(ValidateModelState))]
    public async Task<IActionResult> CreateToken([FromBody] LoginViewModel loginModel)
    {
        bool authenticated = false;
        TokenResult results = new TokenResult();

        User user = await _userManager.FindByNameAsync(loginModel.Username);

        // if able to authenticate, get the token
        if (user != null)
        {
            Microsoft.AspNetCore.Identity.SignInResult signInResult = await _signInManager.CheckPasswordSignInAsync(user, loginModel.Password, false);
            if (signInResult.Succeeded)
            {
                results = await _accountBehaviour.GetTokenResult(user);
                authenticated = true;
            }

        }

        if (authenticated)
            return Created("", results);
        else
            return Unauthorized();
    }

    /// <summary>
    /// Creates a new JWT Bearer Token when the previous has expired
    /// </summary>
    /// <param name="tokenData">The Refresh Token view model</param>
    /// <returns>JWT Bearer Token</returns>
    [HttpPost("[action]")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenViewModel tokenData)
    {
        SecurityToken currentToken;
        var currentClaims = new JwtSecurityTokenHandler().ValidateToken(tokenData.Token, new TokenValidationParameters()
        {
            ValidIssuer = _config["Tokens:Issuer"],
            ValidAudience = _config["Tokens:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"] ?? "")),
            ValidateLifetime = false
        }, out currentToken);

        if (currentToken.ValidTo.AddHours(2) < DateTime.Now)
            throw new UnauthorizedAccessException("Token has expired");

        User user = await _userManager.FindByIdAsync(tokenData.UserId);
        bool isValid = await _userManager.VerifyUserTokenAsync(user, "Default", "Refresh Token", tokenData.RefreshToken);
        if (user.UserName != currentClaims.Claims.Where(c => c.Type == JwtRegisteredClaimNames.UniqueName).FirstOrDefault()?.Value)
            throw new UnauthorizedAccessException("Invalid User ID");
        try
        {
            _accountBehaviour.RemoveUserToken(user.Id, "Refresh Token", tokenData.RefreshToken);
        }
        catch (System.InvalidOperationException)
        {
            throw new UnauthorizedAccessException("Refresh Token not found");
        }

        if (isValid)
        {
            var token = _accountBehaviour.GetJwtToken(user);

            var refreshToken = await _userManager.GenerateUserTokenAsync(user, "Default", "Refresh Token");
            _accountBehaviour.AddUserToken(user.Id, "Refresh Token", refreshToken);
            var results = new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                refreshToken = refreshToken,
                expiration = token.ValidTo,
                user = user.Id
            };

            return Created("", results);
        }
        else
            throw new UnauthorizedAccessException("Invalid user credentials");
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost("[action]")]
    [ServiceFilter(typeof(ValidateModelState))]
    public async Task<ActionResult<string>> GetUsername([FromBody] GenericViewModel userId)
    {
        User? user = null;
        user = await _userManager.FindByIdAsync(userId.Value);
        if (user != null)
            return JsonSerializer.Serialize(user.UserName);
        else
            return JsonSerializer.Serialize(user);
    }

    /// <summary>
    /// Checks a username is available
    /// </summary>
    /// <param name="username"></param>
    /// <returns>True if available</returns>
    [HttpPost("[action]")]
    [ServiceFilter(typeof(ValidateModelState))]
    public async Task<ActionResult<bool>> IsUsernameAvailable([FromBody] GenericViewModel username) 
        => Ok((await _userManager.FindByNameAsync(username.Value)) == null);

    /// <summary>
    /// Creates a new user
    /// </summary>
    /// <param name="loginViewModel"</param>
    /// <returns>Action result</returns>
    [HttpPost("[action]")]
    [ServiceFilter(typeof(ValidateModelState))]
    public async Task<IActionResult> New([FromBody] LoginViewModel loginViewModel)
    {
        if (await _accountBehaviour.AddUser(loginViewModel))
            return Ok();

        return BadRequest();
    }

}
