/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Todo
*  Date:      15 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Register
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  15 AUG 2023 GM          Created
************************************************************************/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../shared/services/message.service';
import { ControlValidation } from '../../shared/utilities/control-validation';
import { ElementFocus } from '../../shared/utilities/element-focus';
import { Whitelist } from '../../shared/models/whitelist';
import { WhitelistService } from '../../shared/services/whitelist.service';
import { TextValidators } from '../../shared/validators/text.validator';
import { Login } from '../../shared/models/login';
import { Router } from '@angular/router';
import { ViewModelDataService } from '../../shared/services/view-model-data.service';
import { take } from 'rxjs';
import { Message } from '../../shared/models/message';
import { MessageType } from '../../shared/models/message-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { UsernameValidator } from '../../shared/validators/username.validator';
import { PendingChanges } from '../../shared/classes/pending-changes';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent extends PendingChanges implements OnInit {

  elementHasFocus = ElementFocus.elementHasFocus;
  isControlInvalid = ControlValidation.isInvalid;

  nameWhitelist: Whitelist = new Whitelist();
  descWhitelist: Whitelist = new Whitelist();
  usernameWhitelist: Whitelist = new Whitelist();
  passwordWhitelist: Whitelist = new Whitelist();

  isProcessing: boolean = false;
  registerForm!: FormGroup;

  constructor(
    private router: Router, private formBuilder: FormBuilder, private whitelistService: WhitelistService, private messageService: MessageService,
    private viewModelDataservice: ViewModelDataService, private authenticationService: AuthenticationService
  ) { super() }

  async ngOnInit(): Promise<void> {
    this.nameWhitelist = await this.whitelistService.getWhitelist("NAME");
    this.descWhitelist = await this.whitelistService.getWhitelist("DESC");
    this.usernameWhitelist = await this.whitelistService.getWhitelist("USERNAME");
    this.passwordWhitelist = await this.whitelistService.getWhitelist("PASSWORD");
    this.initForm();
    this.pendingFormGroup = this.registerForm;
  }

  /**
   * Initialise Form
   */
  initForm() {
    this.registerForm = this.formBuilder.group({
      firstname: ['', { validators: [Validators.required, TextValidators.whitelistValidator(this.nameWhitelist)], updateOn: 'blur' }],
      lastname: ['', { validators: [Validators.required, TextValidators.whitelistValidator(this.nameWhitelist)], updateOn: 'blur' }],
      email: ['', { validators: [Validators.required, TextValidators.whitelistValidator(this.descWhitelist), TextValidators.emailValidator()], updateOn: 'blur' }],
      username: ['', { validators: [Validators.required, TextValidators.whitelistValidator(this.usernameWhitelist), TextValidators.minLengthValidator(4)], asyncValidators: [UsernameValidator.createValidator(this.viewModelDataservice)], updateOn: 'blur' }],
      passwordGroup: this.formBuilder.group({
        password: ['', { validators: [Validators.required, TextValidators.whitelistValidator(this.passwordWhitelist), TextValidators.minLengthValidator(8)], updateOn: 'blur' }],
        confirmPassword: ['', { validators: [Validators.required], updateOn: 'blur' }],
      }, { validator: TextValidators.matchValidator("password", "confirmPassword", true) }),
    });
  }

  /**
   * Register
   */
  onRegister() {
    this.isProcessing = true;
    const login: Login = new Login(this.registerForm.value);
    login.password = (this.registerForm?.get("passwordGroup.password")?.value ?? "");
    this.viewModelDataservice.actionViewModel<Login, Login>(login, "account", "New", false).pipe(take(1)).subscribe(
      () => {
        this.messageService.sendMessage(new Message("nav-menu", "User successfully created", MessageType.Info));
        this.registerForm.markAsPristine();
        if (this.authenticationService.isAuthenticated())
          this.authenticationService.logout();
        this.router.navigate(["/login"]);
        this.isProcessing = false;
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400)
          this.messageService.sendMessage(new Message("nav-menu", "Unable to create user", MessageType.Danger));
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
    this.registerForm.patchValue(new Login());
    this.registerForm.get("passwordGroup")?.patchValue({ "password": "", "confirmPassword": "" });
    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();
    this.isProcessing = false;
  }

}
