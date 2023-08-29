/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Services
*  Date:      03 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Modal Dialog Service
*  Notes:
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  03 AUG 2023 GM          Created
************************************************************************/

import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalDialogComponent, ModalType, ModalReturn } from "../components/modal-dialog/modal-dialog.component"

@Injectable({
  providedIn: 'root'
})
export class ModalDialogService {

  constructor(private modalService: NgbModal,) { }

  /**
   * Call Modal Dialog
   * @param modalType
   * @returns
   */
  public async callModalDialog(modalType: ModalType, titleTextOverride?: string, bodyText?: string): Promise<ModalReturn> {

    let modalReturn: ModalReturn = ModalReturn.Close;

    const modal = this.modalService.open(ModalDialogComponent, { windowClass: "custom-ngb-modal-window", backdropClass: "custom-ngb-modal-backdrop" });
    modal.componentInstance.modalType = modalType;
    if (titleTextOverride)
      modal.componentInstance.titleTextOverride = titleTextOverride;
    if (bodyText)
      modal.componentInstance.bodyText = bodyText;
    await modal.result
      .then(result => { modalReturn = result })
      .catch(error => {
      if (error == 1)
        modalReturn = ModalReturn.Dismiss;
    });

    return modalReturn;
  }
}
