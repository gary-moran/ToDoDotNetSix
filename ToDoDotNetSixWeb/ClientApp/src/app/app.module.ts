/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App
*  Date:      25 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  App Module
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  25 JUL 2023 GM          Created
************************************************************************/

import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { TodoModule } from './todo/todo.module';
import { AppConfigService } from './shared/services/app-config.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppConfigInterceptorService } from './shared/interceptors/app-config-interceptor.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { AuthenticationInterceptorService } from './shared/interceptors/authentication-interceptor.service';
import { PendingChangesGuard } from './shared/guards/pending-changes.guard';

export function initApp(appConfigService: AppConfigService) { return () => appConfigService.load(); }

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    SharedModule,
    TodoModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
    ]),
    NgbModule,
  ],
  providers: [
    PendingChangesGuard,
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [AppConfigService]
    },
    { provide: HTTP_INTERCEPTORS, useClass: AppConfigInterceptorService, multi: true, deps: [AppConfigService] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptorService, multi: true, deps: [AppConfigService, AuthenticationService] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
