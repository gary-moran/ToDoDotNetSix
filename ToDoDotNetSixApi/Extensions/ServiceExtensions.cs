/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Extensions
*  Date:      07 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Service Extensions
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  07 JUL 2023 GM          Created
************************************************************************/

using ToDoDotNetSixApi.ActionFilters;
using System.Reflection;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace ToDoDotNetSixApi.Extensions;

public static class ServiceExtensions
{
    /// <summary>
    /// Extension method to configure Identity and Authentication
    /// </summary>
    /// <param name="services">IServiceCollection</param>
    /// <param name="configuration">Configuration</param>
    public static void ConfigureIdentityAndAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        //AuthenticationLockout authenticationLockout = (AuthenticationLockout)configuration.GetSection("AuthenticationLockout")?.Get<AuthenticationLockout>() ?? new AuthenticationLockout();

        services.AddIdentity<Data.Entities.User, IdentityRole>(cfg =>
        {
            cfg.User.RequireUniqueEmail = true;
            cfg.Password.RequireNonAlphanumeric = false;
            cfg.Password.RequireUppercase = false;
            cfg.Password.RequireLowercase = false;
            cfg.Password.RequireDigit = false;
            //cfg.Lockout.AllowedForNewUsers = authenticationLockout.Enabled;
            //cfg.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(authenticationLockout.TimeSpan);
            //cfg.Lockout.MaxFailedAccessAttempts = authenticationLockout.Attempts;
        })
          .AddEntityFrameworkStores<Data.Context>().AddDefaultTokenProviders();

        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

        services.AddAuthentication()
            .AddJwtBearer(cfg =>
            {
                cfg.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidIssuer = configuration["Tokens:Issuer"],
                    ValidAudience = configuration["Tokens:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Tokens:Key"] ?? ""))
                };
                cfg.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        // If the request is for our hub...
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            (path.StartsWithSegments("/eventHub")))
                        {
                            // Read the token out of the query string
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
    }

    /// <summary>
    /// Extension method to configure CORS
    /// </summary>
    /// <param name="services">IServiceCollection</param>
    /// <param name="configuration"></param>
    public static void ConfigureCors(this IServiceCollection services, IConfiguration configuration)
    {
        // Enable Cross-Origin Requests - required for ClientApp access to the Web API
        services.AddCors(options =>
        {
            options.AddPolicy("WebAppUrl", builder =>
            {
                builder.WithOrigins(configuration.GetValue<string>("WebAppUrl") ?? "")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });
    }

    /// <summary>
    /// Extension method to configure Types for "Validate Entity Exists" action filter
    /// </summary>
    /// <param name="services">IServiceCollection</param>
    /// <param name="namespaceString"></param>
    /// <param name="contract">conforming interface, super type or type</param>
    public static void ConfigureTypesForValidateEntityExists(this IServiceCollection services, string namespaceString, Type? contract = null)
    {
        foreach (Type type in Assembly.GetExecutingAssembly().GetTypes().Where(entity => entity.IsClass && entity.Namespace == namespaceString)?.ToArray() ?? new Type[0])
        {
            if (contract == null || contract.IsAssignableFrom(type))
            {
                Type genericClass = typeof(ValidateEntityExists<>);
                Type constructedClass = genericClass.MakeGenericType(type);

                services.AddScoped(constructedClass);
            }
        }
    }

    /// <summary>
    /// Extension method to configure Types for "Validate Entity Exists Model Valid" action filter
    /// </summary>
    /// <param name="services">IServiceCollection</param>
		/// <param name="namespaceString"></param>
    /// <param name="contract">conforming interface, super type or type</param>
    public static void ConfigureTypesForValidateEntityExistsModelValid(this IServiceCollection services, string namespaceString, Type? contract = null)
    {
        foreach (Type type in Assembly.GetExecutingAssembly().GetTypes().Where(entity => entity.IsClass && entity.Namespace == namespaceString)?.ToArray() ?? new Type[0])
        {
            if (contract == null || contract.IsAssignableFrom(type))
            {
                Type genericClass = typeof(ValidateEntityExistsModelValid<>);
                Type constructedClass = genericClass.MakeGenericType(type);

                services.AddScoped(constructedClass);
            }
        }
    }
}
