/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Components
*  Date:      03 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Modal Dialog Component
*  Notes:
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  03 AUG 2023 GM          Created
************************************************************************/

import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export enum ModalType {
  Save,
  Cancel,
  Delete,
  YesNo,
  Ok,
  OkCancel
}

export enum ModalReturn {
  Save,
  Cancel,
  Delete,
  Close,
  Yes,
  No,
  Ok
}

@Component({
  selector: 'modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModalDialogComponent implements OnInit {
  @Input() modalType: ModalType = ModalType.Save;
  @Input() titleTextOverride?: string;
  @Input() bodyText?: string;

  titleText: string = "";
  isSaveButton: boolean = false;
  isCancelButton: boolean = false;
  isDeleteButton: boolean = false;
  isCloseButton: boolean = false;
  isYesButton: boolean = false;
  isNoButton: boolean = false;
  isOkButton: boolean = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.SetupModalDialog();
  }

  /**
   * Setup Modal Dialog
   */
  SetupModalDialog(): void {

    switch (this.modalType) {
      case ModalType.Save:
        this.titleText = "Save Changes";
        this.isSaveButton = true;
        this.isCloseButton = true;
        break;
      case ModalType.Cancel:
        this.titleText = "Cancel Changes";
        this.isCancelButton = true;
        this.isCloseButton = true;
        break;
      case ModalType.Delete:
        this.titleText = "Delete Record";
        this.isDeleteButton = true;
        this.isCloseButton = true;
        break;
      case ModalType.YesNo:
        this.titleText = "Do you wish to continue";
        this.isYesButton = true;
        this.isNoButton = true;
        break;
      case ModalType.Ok:
        this.titleText = "";
        this.isOkButton = true;
        break;
      case ModalType.OkCancel:
        this.titleText = "Click OK to continue, else click Cancel";
        this.isOkButton = true;
        this.isCancelButton = true;
        break;
    }

    // override
    if (this.titleTextOverride)
      this.titleText = this.titleTextOverride;
  }

  /**
   * On Save
   */
  onSave(): void {
    this.activeModal.close(ModalReturn.Save);
  }

  /**
   * On Cancel
   */
  onCancel(): void {
    this.activeModal.close(ModalReturn.Cancel);
  }

  /**
   * On Delete
   */
  onDelete(): void {
    this.activeModal.close(ModalReturn.Delete);
  }

  /**
   * On Yes
   */
  onYes(): void {
    this.activeModal.close(ModalReturn.Yes);
  }

  /**
   * On No
   */
  onNo(): void {
    this.activeModal.close(ModalReturn.No);
  }

  /**
   * On OK
   */
  onOk(): void {
    this.activeModal.close(ModalReturn.Ok);
  }

  /**
   * On Close
   */
  onClose(): void {
    this.activeModal.close(ModalReturn.Close);
  }
}
