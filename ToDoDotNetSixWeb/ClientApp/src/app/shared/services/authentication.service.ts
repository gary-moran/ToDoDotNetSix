/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Services
*  Date:      09 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Authentication Service
*  Notes:
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  10 AUG 2023 GM          Created
************************************************************************/

/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, first, map, Observable, shareReplay, Subject, throwError } from 'rxjs';
import { Generic } from '../models/generic';
import { Login } from '../models/login';
import { Message } from '../models/message';
import { MessageType } from '../models/message-type.enum';
import { IsTrue } from '../utilities/is-true';
import { AppConfigService } from './app-config.service';
import { MessageService } from './message.service';
import { ViewModelDataService } from './view-model-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _authenticated$ = new Subject<boolean>();
  authenticated$ = this._authenticated$.pipe(shareReplay(1));

  private _logout$ = new BehaviorSubject<boolean>(false);
  logout$ = this._logout$.asObservable();

  private apiBaseUrl: string = "";
  private token: string = "";
  private tokenExpiration: Date | null = new Date();
  private userId: string | null = null;
  private username: string | null = null;
  private jwtHelper: JwtHelperService;
  private authenticated: boolean = false;
  private refreshPending: boolean = false;

  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient,
    private messageService: MessageService,
    private router: Router,
    private viewModelDataService: ViewModelDataService
  ) {

    // authenticate and store token

    this.jwtHelper = new JwtHelperService();

    this.appConfigService.AppConfig.subscribe((config) => {
      if (config) {
        this.apiBaseUrl = config?.WebApi ?? "";
        const session = this.getSession();
        if (session != null && !this.authenticated) {
          if (!this.jwtHelper.isTokenExpired(session.token)) {
            this.token = session.token;
            this.tokenExpiration = this.jwtHelper.getTokenExpirationDate(session.token);
            this.userId = session.user;
            this.newAuthenticationEvent(true);
          } else {
            this.refreshToken().subscribe(() => { });
          }
        }
      }
    });

  }

  /**
  * Check if the current session is Authenticated
  */
  checkAuthenticated(): boolean {

    if (!this.isAuthenticated(true)) {
      this.logout();
      this.router.navigate(["/login"]);
      this.messageService.sendMessage(new Message("nav-menu", "The current session has expired", MessageType.Info), true);
      return false;
    } else
      return true;

  }

  /**
   * Returns whether the user is authenticated
   */
  isAuthenticated(recheckSession: boolean = false): boolean {

    if (recheckSession) {

      // Grab the latest version of the current session before checking the Auth Status
      const session = this.getSession();
      if (session) {
        this.token = session.token;
        this.userId = session.user;
        return IsTrue.eval(this.userId) && IsTrue.eval(this.token) && !this.jwtHelper.isTokenExpired(this.token);
      } else {
        // No session then log out user
        return false;
      }

    } else {
      return IsTrue.eval(this.userId) && IsTrue.eval(this.token) && !this.jwtHelper.isTokenExpired(this.token) && this.authenticated;
    }
  }

  /**
   * Creates a new authentication event
   * @param authenticated
   */
  newAuthenticationEvent(authenticated: boolean) {
    this.authenticated = authenticated;
    this._authenticated$.next(authenticated);
  }

  /**
   * Attempts to refresh the users authentication token
   */
  public refreshToken(): Observable<any> {

    if (!this.refreshPending) {

      this.refreshPending = true;
      const session = this.getSession();

      if (session) {
        return this.httpClient.post(`${this.apiBaseUrl}/api/account/refreshtoken`, { refreshToken: session.refreshToken, userId: session.user, token: session.token })
          .pipe(map((response: any) => {

          this.token = response.token;
          this.tokenExpiration = response.expiration;
          this.setSession(response);
          this.userId = response.user;
          this.newAuthenticationEvent(true);
          this.refreshPending = false;
          return response;

        }), catchError((error: any) => {

          this.removeSession();
          this.newAuthenticationEvent(false);
          this.router.navigate(["/login"]);
          this.refreshPending = false;
          return throwError(error);

        }));
      } else {
        throw "Not Logged In";
      }
    } else {
      return this._authenticated$.pipe(first());
    }
  }

  /**
   * Logs in a user
   * @param login The users credentials
   */
  public login(login: Login) {

    return this.httpClient.post<Login>(`${this.apiBaseUrl}/api/account/createtoken`, login)
      .pipe(
        map((response: any) => {
          const tokenInfo = response;
          if (tokenInfo.token === null)
            return false;
          else {
            this.token = tokenInfo.token;
            this.tokenExpiration = tokenInfo.expiration;
            this.setSession(response);
            this.userId = tokenInfo.user;
            this.username = login.username;
            this.newAuthenticationEvent(true);
            return true;
          }
        }));
  }

  /**
   * Logs out the user, also any other tabs too
   */
  logout(): void {
    this.token = "";
    this.userId = null;
    this.removeSession();
    this.newAuthenticationEvent(false);
    this._logout$.next(true);
    this.authenticated$ = this._authenticated$.pipe(shareReplay(1));
  }

  /**
   * Get Username
   */
  async getUsername(): Promise<string | null> {

    if (!this.username) {

      if (this.userId) {
        await this.viewModelDataService.actionViewModel<Generic, string>(new Generic(this.userId), "account", "GetUsername").toPromise().then(username => {
          if (username)
              this.username = username;
          });
      }

    }

    return this.username;

  }

  /**
   * Handler to set the session
   * @param response
   */
  public setSession(response: any): void {
    localStorage.setItem('session', JSON.stringify(response));
  }

  /**
   * Handler to get the session
   */
  public getSession(): any {
    const session: any = localStorage.getItem('session');

    if (!session)
      return null;
    return JSON.parse(session);
  }

  /**
   * Handler to remove the session
   */
  private removeSession(): void {
    localStorage.removeItem('session');
  }

  /**
   * Handler to get the users token
   */
  public getToken(): any {
    const session = this.getSession();
    if (session)
      return session.token;
    else
      return null;
  }

}
