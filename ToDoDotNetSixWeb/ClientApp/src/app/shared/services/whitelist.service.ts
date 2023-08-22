/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Services
*  Date:      09 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Whitelist Service
*  Notes:
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  09 AUG 2023 GM          Created
************************************************************************/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'is-what';
import { take } from 'rxjs';
import { Whitelist } from '../models/whitelist';
import { AppConfigService } from './app-config.service';

@Injectable(
  { providedIn: 'root' }
)
export class WhitelistService {

  private apiBaseUrl: string = "";
  private whitelists: Whitelist[] | undefined;

  constructor(private http: HttpClient, private appConfigService: AppConfigService) {
    this.appConfigService.AppConfig.pipe(take(1)).subscribe(config => this.apiBaseUrl = `${config?.WebApi ?? ""}/api/Whitelist`);
  }

  /**
  * Get all Whitelists
  * @returns whitelists
  */
  private getAllWhitelists() {
    return this.http.get<Whitelist[]>(this.apiBaseUrl);
  }

  /**
   * Set Whitelists
   */
  private async setWhitelists(): Promise<void> {
    await this.getAllWhitelists().toPromise().then(whitelists => this.whitelists = whitelists);
  }

  /**
  * Get Whitelist
  * @returns whitelist
  * @param patternType the whitelist type
  */
  async getWhitelist(patternType: string): Promise<Whitelist> {

    if (isNullOrUndefined(this.whitelists) || this.whitelists.length == 0)
      await this.setWhitelists();

    const whitelist: Whitelist = this.whitelists?.find(l => l.type == patternType) ?? new Whitelist();

    return whitelist;
  }

}

