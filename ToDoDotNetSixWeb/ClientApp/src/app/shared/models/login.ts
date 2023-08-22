/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Models
*  Date:      11 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Login model
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  11 AUG 2023 GM          Created
************************************************************************/

export class Login {
  constructor(login?: Login) {
    this.username = login?.username ?? "";
    this.password = login?.password ?? "";
    this.email = login?.email ?? "";
    this.firstname = login?.firstname ?? "";
    this.lastname = login?.lastname ?? "";
  }

  username: string;
  password: string;
  email?: string;
  firstname?: string;
  lastname?: string;
}
