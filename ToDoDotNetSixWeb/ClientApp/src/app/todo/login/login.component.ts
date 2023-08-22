/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Todo
*  Date:      09 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Login
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  09 AUG 2023 GM          Created
************************************************************************/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../shared/services/message.service';
import { ControlValidation } from '../../shared/utilities/control-validation';
import { ElementFocus } from '../../shared/utilities/element-focus';
import { Whitelist } from '../../shared/models/whitelist';
import { WhitelistService } from '../../shared/services/whitelist.service';
import { TextValidators } from '../../shared/validators/text.validator';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Login } from '../../shared/models/login';
import { Router } from '@angular/router';
import { Message } from '../../shared/models/message';
import { MessageType } from '../../shared/models/message-type.enum';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{

  elementHasFocus = ElementFocus.elementHasFocus;
  isControlInvalid = ControlValidation.isInvalid;

  usernameWhitelist: Whitelist = new Whitelist();
  passwordWhitelist: Whitelist = new Whitelist();

  isProcessing: boolean = false;
  loginForm!: FormGroup;

  constructor(private authenticationService: AuthenticationService, private router: Router, private formBuilder: FormBuilder, private whitelistService: WhitelistService, private messageService: MessageService,) { }

  async ngOnInit(): Promise<void> {
    this.usernameWhitelist = await this.whitelistService.getWhitelist("USERNAME");
    this.passwordWhitelist = await this.whitelistService.getWhitelist("PASSWORD");
    this.initForm();
  }

  /**
   * Initialise Form
   */
  initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', { validators: [Validators.required, TextValidators.whitelistValidator(this.usernameWhitelist), TextValidators.minLengthValidator(4)], updateOn: 'blur' }],
      password: ['', { validators: [Validators.required, TextValidators.whitelistValidator(this.passwordWhitelist), TextValidators.minLengthValidator(8)], updateOn: 'blur' }],
    });
  }

  onRegister() {
    this.isProcessing = true;
    this.router.navigate(["/register"]);
    this.isProcessing = false;
  }

  /**
   * Login
   */
  onLogin() {
    this.isProcessing = true;
    const authenticationMessage: Message = new Message("nav-menu", "There has been a problem authenticating your credentials", MessageType.Danger);
    const login: Login = new Login(this.loginForm.value);
    this.authenticationService.login(login).pipe(take(1)).subscribe(success => {
      if (success)
        this.router.navigate(["/todo"]);
      else {
        this.messageService.sendMessage(authenticationMessage);
      }
      this.isProcessing = false;
    }, error => {
      if (error.status && error.status == 401)
        this.messageService.sendMessage(authenticationMessage);
      else
        this.messageService.sendErrorMessage(error);
      this.isProcessing = false;
    });
  }

  /**
   * Cancel
   */
  onCancel() {
    this.isProcessing = true;
    this.loginForm.patchValue(new Login());
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.isProcessing = false;
  }
}
