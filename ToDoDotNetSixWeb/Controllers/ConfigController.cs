/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Controllers
*  Date:      25 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Config Controller
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  25 JUL 2023 GM          Created
************************************************************************/

using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Reflection;

namespace ToDoDotNetSixWeb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfigController : Controller
{
    private readonly IConfiguration _config;

    public ConfigController(IConfiguration config) => _config = config;

    [HttpGet("")]
    public IActionResult Get() => Ok(GetAngularSettings());

    /// <summary>
    /// Get Angular Settings
    /// </summary>
    /// <returns>JSON</returns>
    private JObject GetAngularSettings()
    {
        var targetSection = "AngularSettings";
        JObject json = new JObject();

        foreach (var item in _config.GetSection(targetSection).AsEnumerable().Where(x => x.Key != targetSection))
        {
            bool bTest;
            double dTest;
            JToken token;
            if (Boolean.TryParse(item.Value, out bTest))
                token = JToken.FromObject(bTest);
            else if (Double.TryParse(item.Value, out dTest))
                token = JToken.FromObject(dTest);
            else
                token = JToken.FromObject(item.Value);

            json.Add(item.Key.StripTarget($"{targetSection}:"), token);
        }

        // add app version to Angular Settings from the Assembly
        string version = Assembly.GetEntryAssembly().GetName().Version.ToString();
        json.Add("AppVersion", version);

        return json;
    }
}

public static class StringExtensions
{
    /// <summary>
    /// Strip target string from value if it exists
    /// </summary>
    /// <param name="value"></param>
    /// <param name="target"></param>
    /// <returns>Stripped string</returns>
    public static string StripTarget(this string value, string target) => value.StartsWith(target) ? value.Substring(target.Length) : value;
}
