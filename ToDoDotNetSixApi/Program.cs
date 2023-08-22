/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Main
*  Date:      06 JUL 2023
*  Author:    Gary Moran (GM)
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  06 JUL 2023 GM          Created
************************************************************************/

using ToDoDotNetSixApi.Data.Mapping;
using Microsoft.EntityFrameworkCore;
using Serilog;
using ToDoDotNetSixApi.ActionFilters;
using ToDoDotNetSixApi.Data;
using ToDoDotNetSixApi.Extensions;
using ToDoDotNetSixApi.Data.Repo;
using Microsoft.AspNetCore.Identity;
using ToDoDotNetSixApi.Data.Entities;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Use Serilog for logging
builder.Host.UseSerilog((hostContext, loggerConfiguration) => loggerConfiguration.ReadFrom.Configuration(builder.Configuration));

// Add services to the container.
builder.Services.AddDbContext<Context>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddControllers();

// Configure Identity and Authentication
builder.Services.ConfigureIdentityAndAuthentication(builder.Configuration);

// Configure CORS
builder.Services.ConfigureCors(builder.Configuration);

// Configure action Filters
builder.Services.AddScoped<ValidateIdParam>();
builder.Services.AddScoped<ValidateModelState>();
builder.Services.AddScoped<ValidateIEntityState>();

// Configure entities
builder.Services.ConfigureTypesForValidateEntityExists("ToDoDotNetSixApi.Data.Entities", typeof(IEntity));
builder.Services.ConfigureTypesForValidateEntityExistsModelValid("ToDoDotNetSixApi.Data.Entities", typeof(IEntity));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// initialise DB
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<Context>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    DbInitializer.Initialize(context, userManager).Wait();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

MiddlewareExtensions.ConfigureCustomMiddleware(app);

app.UseHttpsRedirection();

app.UseCors("WebAppUrl");

app.UseAuthorization();

app.MapControllers();

app.Run();
