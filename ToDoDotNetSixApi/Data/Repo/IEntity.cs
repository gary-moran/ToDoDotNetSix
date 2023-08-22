/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Data
*  Date:      21 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Entity Interface
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  21 JUL 2023 GM          Created
************************************************************************/

namespace ToDoDotNetSixApi.Data.Repo;

public interface IEntity
{
    long Id { get; set; }
}
