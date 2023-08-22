/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data Mapping
*  Date:      07 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Mapping Profile
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  07 JUL 2023 GM          Created
************************************************************************/

using AutoMapper;
using ToDoDotNetSixApi.Data.Entities;
using ToDoDotNetSixApi.ViewModels.App;

namespace ToDoDotNetSixApi.Data.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // ToDo
        CreateMap<TodoViewModel, Todo>()
            .ReverseMap();
    }
}
