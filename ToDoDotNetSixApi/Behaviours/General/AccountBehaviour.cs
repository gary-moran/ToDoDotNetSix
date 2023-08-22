/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Behaviours
*  Date:      17 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Account Behaviour
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  17 AUG 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ToDoDotNetSixApi.Data;
using ToDoDotNetSixApi.Data.Entities;
using ToDoDotNetSixApi.ViewModels.General;

namespace ToDoDotNetSixApi.Behaviours.General
{
    public class AccountBehaviour
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _config;
        private readonly Context _context;

        public AccountBehaviour(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration config, Context context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
            _context = context;
        }

        /// <summary>
        /// Get Token Result
        /// </summary>
        /// <param name="user"></param>
        /// <returns>Token Result</returns>
        public async Task<TokenResult> GetTokenResult(User user)
        {
            JwtSecurityToken token = GetJwtToken(user);

            var refreshToken = await _userManager.GenerateUserTokenAsync(user, "Default", "Refresh Token");
            AddUserToken(user.Id, "Refresh Token", refreshToken);

            TokenResult tokenResult = new TokenResult();
            tokenResult.token = new JwtSecurityTokenHandler().WriteToken(token);
            tokenResult.refreshToken = refreshToken;
            tokenResult.expiration = token.ValidTo;
            tokenResult.user = user.Id;

            return tokenResult;
        }

        /// <summary>
        /// Get JWT Bearer Token
        /// </summary>
        /// <param name="user"></param>
        /// <returns>JWT Bearer Token</returns>
        public JwtSecurityToken GetJwtToken(User user)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
            new Claim(JwtRegisteredClaimNames.NameId, user.Id)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            double timeOut = Convert.ToDouble(_config.GetValue("Tokens: Timeout", "30"));

            var token = new JwtSecurityToken(
              _config["Tokens:Issuer"],
              _config["Tokens:Audience"],
              claims,
              expires: DateTime.Now.AddMinutes(timeOut),
              signingCredentials: credentials);

            return token;
        }

        /// <summary>
        /// Adds a user token
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="name">Token Name</param>
        /// <param name="value"></param>
        public void AddUserToken(string userId, string name, string value)
        {
            //Clear old tokens
            var tokens = _context.UserTokens.Where(t => t.UserId == userId && t.Name == name).ToList();
            tokens.ForEach(t => _context.UserTokens.Remove(t));

            //Create new new token
            var token = new IdentityUserToken<string>();
            token.UserId = userId;
            token.Value = value;
            token.Name = name;
            token.LoginProvider = "Default";
            _context.UserTokens.Add(token);
            _context.SaveChanges();
        }

        /// <summary>
        /// Removes a user token
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="name">Token Name</param>
        /// <param name="token"></param>
        public void RemoveUserToken(string userId, string name, string token)
        {
            var tmp = _context.UserTokens.First(t => t.UserId == userId && t.Name == name && t.Value == token);
            _context.UserTokens.Remove(tmp);
            _context.SaveChanges();
        }

        /// <summary>
        /// Add User
        /// </summary>
        /// <param name="loginViewModel">Login View Model</param>
        /// <returns>true if successful</returns>
        public async Task<bool> AddUser(LoginViewModel loginViewModel)
        {
            bool addUser = false;

            var findUser = await _userManager.FindByNameAsync(loginViewModel.Username);

            if (findUser == null)
            {
                User user = new User(loginViewModel);
                var result = await _userManager.CreateAsync(user, loginViewModel.Password);
                addUser = result.Succeeded;
            }

            return addUser;
        }

        public class TokenResult
        {
            public string? token { get; set; }
            public string? refreshToken { get; set; }
            public DateTime expiration { get; set; }
            public string? user { get; set; }
        }
    }
}
