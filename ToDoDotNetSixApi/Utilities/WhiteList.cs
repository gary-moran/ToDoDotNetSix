/**************************************************************************
*
*  System:    ToDo (API)
*  Module:    Utilities
*  Date:      07 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Whitelist
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  07 JUL 2023 GM          Created
************************************************************************/

using System.Reflection;
using ToDoDotNetSixApi.ViewModels.General;

namespace ToDoDotNetSixApi.Utilities;

public class Whitelist
{
    public class WhitelistDetails
    {
        public const string NUM = "^[0-9]+$";
        public const string NUM_ERROR = "INVALID_NUM";
        public const string NUMSYM = @"^[0-9\.\+ /\\-]+$";
        public const string NUMSYM_ERROR = "INVALID_NUMSYM";
        public const string ALPHA = "^[A-Za-z ]+$";
        public const string ALPHA_ERROR = "INVALID_ALPHA";
        public const string TEXT = "^[A-Za-z0-9 /]+$";
        public const string TEXT_ERROR = "INVALID_TEXT";
        public const string NAME = "^[A-Za-z' ]+$";
        public const string NAME_ERROR = "INVALID_NAME";
        public const string ADDRESS = @"^[A-Za-z0-9' ,\.-]+$";            
        public const string ADDRESS_ERROR = "INVALID_ADDRESS";
        public const string DESC = @"^[A-Za-z0-9' ,!:;&/""£%=@#><~_`\]\?\[\(\)\$\*\\\.\+\|-]+$";
        public const string DESC_ERROR = "INVALID_DESCRIPTION";
        public const string FILENAME = @"^[A-Za-z0-9' _\(\)\.-]+$";
        public const string FILENAME_ERROR = "INVALID_FILENAME";
        public const string ALPHANUM = "^[0-9A-Za-z ]+$";
        public const string ALPHANUM_ERROR = "INVALID_ALPHANUM";
        public const string USERNAME = @"^[A-Za-z0-9_-]+$";
        public const string USERNAME_ERROR = "INVALID_USERNAME";
        public const string PASSWORD = @"^[A-Za-z0-9' ,!:;&/""£%=@#><~_`\]\?\[\(\)\$\*\\\.\+\|-]+$";
        public const string PASSWORD_ERROR = "INVALID_PASSWORD";
    }

    /// <summary>
    /// Get a Whitelist
    /// </summary>
    /// <param name="type"></param>
    /// <returns>Whitelist</returns>
    public static WhitelistViewModel GetWhitelist(string type)
    {
        List<WhitelistViewModel> lists = GetWhitelists();
        WhitelistViewModel list = lists.Find(l => l.Type == type) ?? new WhitelistViewModel();            
        return list;
    }

    /// <summary>
    /// Get All Whitelists
    /// </summary>
    /// <returns>All Whitelist</returns>
    public static List<WhitelistViewModel> GetWhitelists()
    {
        List<WhitelistViewModel> lists = new List<WhitelistViewModel>();
        WhitelistViewModel list = new WhitelistViewModel();

        foreach (FieldInfo info in typeof(Whitelist.WhitelistDetails).GetFields().Where(f => f.IsStatic && f.IsLiteral))
        {
            if (info.Name.Contains("_ERROR"))
            {
                list.Error = info.GetValue(info)?.ToString() ?? "";
                lists.Add(list);
                list = new WhitelistViewModel();
            }
            else
            {
                list.Type = info.Name;
                list.Pattern = info.GetValue(info)?.ToString() ?? "";
            }               
        }
        return lists;
    }
}
