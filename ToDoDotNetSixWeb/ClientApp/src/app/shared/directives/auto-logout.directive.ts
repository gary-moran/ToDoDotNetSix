/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Directives
*  Date:      24 MAY 2023
*  Author:    Craig Wallace (CW)
*  Function:  Auto-logout Directive
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  24 MAY 2023 CW          Created
************************************************************************/

import { Directive, OnDestroy } from '@angular/core';
import { AppConfig, AppConfigService } from '../services/app-config.service';
import { Subject, timer } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Directive({
  selector: 'auto-logout'
})
export class AutoLogoutDirective implements OnDestroy {

  constructor(private authenticationService: AuthenticationService, private appConfigService: AppConfigService) { }

  componentIsDestroyed$ = new Subject<boolean>();

/**
* Captures the pages ngOnDestroy and stops timer which checks the Authorised Status
*/
  async ngOnDestroy() {
    this.componentIsDestroyed$.next(true);
    this.componentIsDestroyed$.complete();
  }

 /**
 * Captures the pages ngOnInit and starts timer to check the Authorised Status
 */
  async ngOnInit() {
    
    let logoutTimerInterval: number = 120000;        // Default 2 Mins

    this.appConfigService.AppConfig.pipe(take(1)).subscribe(cfg => {

      let config: AppConfig | undefined;

      if (cfg)
        config = cfg;

      // Get timer interval from app settings and converts to milliseconds
      if (config) {
        logoutTimerInterval = (config?.LogoutTimerIntervalSeconds ?? 120) * 1000
      }

      // Setup Logout Timer Check
      const logoutCheckTimer = timer(logoutTimerInterval, logoutTimerInterval);
      logoutCheckTimer.pipe(takeUntil(this.componentIsDestroyed$)).subscribe(() => {

        // If user authorised status is false then log user out
        this.authenticationService.checkAuthenticated();
      });

    });

  }
}
