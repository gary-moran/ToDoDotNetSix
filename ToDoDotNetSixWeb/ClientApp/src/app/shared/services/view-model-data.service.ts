/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Services
*  Date:      25 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  View Model Data Service
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  25 JUL 2023 GM          Created
************************************************************************/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, take } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ViewModelDataService {

  apiBaseUrl: string = "";

  constructor(private http: HttpClient, private appConfigService: AppConfigService, private authenticationService: AuthenticationService, ) {
    this.appConfigService.AppConfig.pipe(take(1)).subscribe(config => this.apiBaseUrl = config?.WebApi ?? "");
  }

  /**
   * Get View Model
   * @type T 
   * @param controller Controller Name
   * @returns View Model
   */
  getViewModel<T>(controller: string, id: number) {
    if (this.authenticationService.checkAuthenticated())
      return this.http.get<T>(`${this.apiBaseUrl}/api/${controller}/${id}`);
    else
      return EMPTY;
  }

  /**
   * Get View Model List
   * @type T 
   * @param controller Controller Name
   * @returns View Model array
   */
  getViewModelList<T>(controller: string) {
    if (this.authenticationService.checkAuthenticated())
      return this.http.get<T[]>(`${this.apiBaseUrl}/api/${controller}/`);
    else
      return EMPTY;
  }

  /**
  * Action View Model
  * @type TModel
  * @type TReturn 
  * @param model View Model
  * @param controller Controller Name
  * @param method Method Name
  * @returns Generic View Model
  */
  actionViewModel<TModel, TReturn>(model: TModel, controller: string, methodName: string) {
    if (this.authenticationService.checkAuthenticated())
      return this.http.post<TReturn>(`${this.apiBaseUrl}/api/${controller}/${methodName}`, model);
    else
      return EMPTY;
  }

  /**
  * Add View Model
  * @type T 
  * @param model View Model
  * @param controller Controller Name
  * @returns Generic View Model
  */
  addViewModel<T>(model: T, controller: string) {
    if (this.authenticationService.checkAuthenticated())
      return this.http.post<T>(`${this.apiBaseUrl}/api/${controller}/`, model);
    else
      return EMPTY;
  }

  /**
  * Update View Model
  * @type T 
  * @param model View Model
  * @param controller Controller Name
  * @param id ID
  * @returns Generic View Model
  */
  updateViewModel<T>(model: T, controller: string, id: number) {
    if (this.authenticationService.checkAuthenticated())
      return this.http.put<T>(`${this.apiBaseUrl}/api/${controller}/${id}`, model);
    else
      return EMPTY;
  }

  /**
   * Delete View Model
   * @param controller Controller Name
   * @param id
   * @returns true if successful
   */
  deleteViewModel(controller: string, id: number) {
    if (this.authenticationService.checkAuthenticated())
      return this.http.delete<boolean>(`${this.apiBaseUrl}/api/${controller}/${id}`);
    else
      return EMPTY;
  }

}
