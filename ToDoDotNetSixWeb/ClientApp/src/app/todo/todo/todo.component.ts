/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Todo
*  Date:      25 JUL 2023
*  Author:    Gary Moran (GM)
*  Function:  Todo Component
*  Notes:     
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  25 JUL 2023 GM          Created
************************************************************************/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, of } from 'rxjs';
import { Message } from '../../shared/models/message';
import { MessageType } from '../../shared/models/message-type.enum';
import { Todo } from '../../shared/models/todo';
import { MessageService } from '../../shared/services/message.service';
import { ViewModelDataService } from '../../shared/services/view-model-data.service';
import { ModalDialogService } from '../../shared/services/modal-dialog.service';
import { ModalReturn, ModalType } from '../../shared/components/modal-dialog/modal-dialog.component';
import { ElementFocus } from '../../shared/utilities/element-focus';
import { ControlValidation } from '../../shared/utilities/control-validation';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Generic } from '../../shared/models/generic';
import { Whitelist } from '../../shared/models/whitelist';
import { WhitelistService } from '../../shared/services/whitelist.service';
import { TextValidators } from '../../shared/validators/text.validator';
import { PendingChanges } from '../../shared/classes/pending-changes';

enum State {
  New,
  Edit,
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent extends PendingChanges implements OnInit {
  elementHasFocus = ElementFocus.elementHasFocus;
  isControlInvalid = ControlValidation.isInvalid;

  username: string | null = null;
  isProcessing: boolean = false;
  todos$: Observable<void | Todo[]> | undefined;
  todo: Todo = new Todo();
  todoForm!: FormGroup;
  state: State = State.New;
  public stateType: typeof State = State;

  alphaNumWhitelist: Whitelist = new Whitelist();
  descWhitelist: Whitelist = new Whitelist();

  get currentId() {
    const id: number = this.todoForm.get('id')?.value ?? -1;
    return id;
  }

  constructor(
    private modalDialogService: ModalDialogService, private viewModelDataService: ViewModelDataService, private formBuilder: FormBuilder, private messageService: MessageService,
    private authenticationService: AuthenticationService, private whitelistService: WhitelistService, 
  ) { super(authenticationService); }

  async ngOnInit(): Promise<void> {
    this.username = await this.authenticationService.getUsername();
    this.alphaNumWhitelist = await this.whitelistService.getWhitelist("ALPHANUM");
    this.descWhitelist = await this.whitelistService.getWhitelist("DESC");
    this.refreshList();
    this.initForm();
    this.pendingFormGroup = this.todoForm;
  }

  /**
   * Initialise Form
   */
  initForm() {
    this.todoForm = this.formBuilder.group({
      id: null,
      name: ['', { validators: [Validators.required, TextValidators.whitelistValidator(this.alphaNumWhitelist)], updateOn: 'blur' }],
      description: ['', { validators: [Validators.required, TextValidators.whitelistValidator(this.descWhitelist)], updateOn: 'blur' }],
      username: this.username,
      isComplete: null,
      updated: null,
    });
  }

  /**
   * Refresh List
   */
  refreshList(): void {
    if (this.username !== null)
      this.todos$ = this.viewModelDataService.actionViewModel<Generic, Todo[]>({ "value": this.username }, "todo", "search")
        .pipe(catchError(error => of(this.messageService.sendErrorMessage({ "message": error }))));
  }

  /**
   * Update Form
   * @param todo
   */
  updateForm(todo: Todo): void {
    if (this.username)
      todo.username = this.username;
    this.todoForm.patchValue(todo);
    this.todoForm.markAsPristine();
    this.todoForm.markAsUntouched();
  }

  /**
   * Refresh Page
   * @param todo
   * @param setNew
   */
  refresh(todo: Todo, setNew: boolean = false): void {
    this.refreshList();
    this.updateForm(todo);
    if (setNew)
      this.state = State.New;
    else
      this.state = State.Edit;
  }

  /**
   * On Select
   * @param todo
   */
  onSelect(todo: Todo): void {
    this.updateForm(todo);
    this.state = State.Edit;
  }

  /**
   * On New
   */
  onNew(): void {
    this.isProcessing = true;
    this.updateForm(new Todo());
    this.state = State.New;
    ElementFocus.setFocusOnElement("name");
    this.isProcessing = false;
  }

  /**
   * On Save
   */
  async onSave(): Promise<void> {

    this.isProcessing = true;

    if (await this.modalDialogService.callModalDialog(ModalType.Save) == ModalReturn.Save) {

      const todo: Todo = new Todo(this.todoForm.value)
      let response: Todo | undefined;

      const saveMessage: string = this.state === State.New ? "Record Created" : "Record Updated";

      if (this.state === State.New) {
        await this.viewModelDataService.addViewModel<Todo>(todo, "todo").toPromise()
          .then(r => { if (r) response = r })
          .catch(error => this.messageService.sendErrorMessage(error));
      }
      else if (this.state === State.Edit && todo.id !== undefined) {
        await this.viewModelDataService.updateViewModel<Todo>(todo, "todo", todo.id).toPromise()
          .then(r => { if (r) response = r })
          .catch(error => this.messageService.sendErrorMessage(error));
      }

      if (response) {
        this.refresh(response);
        this.messageService.sendMessage(new Message("nav-menu", saveMessage, MessageType.Dark));
      }

    }

    this.isProcessing = false;

  }

  /**
   * On Delete
   */
  async onDelete(): Promise<void> {

    this.isProcessing = true;

    if (await this.modalDialogService.callModalDialog(ModalType.Delete) == ModalReturn.Delete) {

      let response: boolean = false;

      await this.viewModelDataService.deleteViewModel("todo", this.todoForm.value.id).toPromise()
        .then(r => { if (r) response = r })
        .catch(error => this.messageService.sendErrorMessage(error));
      if (response) {
        this.refresh(new Todo(), true);
        this.messageService.sendMessage(new Message("nav-menu", "Record Deleted", MessageType.Dark));
      }

    }

    this.isProcessing = false;

  }

}
