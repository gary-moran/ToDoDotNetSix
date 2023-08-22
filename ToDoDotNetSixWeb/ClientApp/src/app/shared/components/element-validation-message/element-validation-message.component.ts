/**************************************************************************
*
*  System:    ToDo (Web)
*  Module:    Client App \ Shared \ Components
*  Date:      04 AUG 2023
*  Author:    Gary Moran (GM)
*  Function:  Element Validation Component
*  Notes:
*
*                   : History of Amendments :
*  Date        Name        Brief description                
*  ----------- ----------  ---------------------------------------------
*  04 AUG 2023 GM          Created
************************************************************************/

import { AfterViewInit, Component, Input, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl} from '@angular/forms';
import { isNullOrUndefined } from 'is-what';
import { Subscription } from 'rxjs';
import { ErrorsTranslation } from '../../utilities/errors-translation';

@Component({
  selector: 'element-validation-message',
  imports: [NgbTooltipModule],
  standalone: true,
  template:
    `<div ngbTooltip placement="bottom" #tooltipVar="ngbTooltip" tooltipClass="my-custom-class" [autoClose]="false" triggers="manual"></div>`,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.my-custom-class .tooltip-inner {
      background-color: red;
    }
    .my-custom-class .tooltip-arrow::before {
      border-bottom-color: red;
    }`
  ]
})

export class ElementValidationMessageComponent implements AfterViewInit, OnDestroy {

  @Input() key!: string;
  @Input() message!: string;
  @Input() model!: AbstractControl | null;
  @ViewChild('tooltipVar', { static: true }) tooltip!: NgbTooltip;

  tooltipMessageText: string | undefined;
  statusChange$!: Subscription;

  ngOnDestroy() {
    this.statusChange$.unsubscribe();
  }

  ngAfterViewInit() {

    // Determine text to display in tooltip and show tooltip
    this.updateTooltipText();

    // setup statusChange$ observable
    if (this.model) {
      this.statusChange$ = this.model.statusChanges.subscribe(() => {
        this.updateTooltipText();
      });
    }
  }

  /**
   * Update Tooltip Text
   */
  private updateTooltipText(): void {

    if (this.model) {

      if (!isNullOrUndefined(this.key)) {
        this.tooltipMessageText = this.key;
      } else if (!isNullOrUndefined(this.message)) {
        this.tooltipMessageText = this.message;
      }

      // if no key or message passed but a model is passed with errors, then extract the errors to determine the messages
      else if (!isNullOrUndefined(this.model.errors)) {

        let messageText: string = "";
        this.tooltipMessageText = "";

        // for each error object
        for (const property in this.model.errors) {

          // we will manually set required message
          const required: boolean = property === 'required' && this.model.errors[property];

          // errors that end with -MSG are our custom error messages, that need to be translated
          if (property.endsWith("-MSG") || required) {
            messageText = required ? "VALIDATION.REQUIRED" : this.model.errors[property] as string;

            // errors can include a parameter, which needs to be removed for translation, then added back in
            const index: number = messageText.indexOf(":");
            let param: string = "";
            if (index > -1) {
              if (!(index + 1 >= messageText.length)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                param = messageText.substring(index + 1);
              }

              // translate message
              messageText = `${ErrorsTranslation.translate(messageText.substr(0, index))}: ${param}`;
            }

            else
              messageText = ErrorsTranslation.translate(messageText);

            // if necessary, append multiple messages
            if (this.tooltipMessageText == "")
              this.tooltipMessageText = messageText;
            else
              this.tooltipMessageText = `${this.tooltipMessageText}; ${messageText}`;
          }
        }
      }

      // Close tooltip if already open
      if (this.tooltip.isOpen())
        this.tooltip.close();

      // Set text to display
      this.tooltip.ngbTooltip = this.tooltipMessageText;

      // Open tooltip
      this.tooltip.open();
    }
  }
}
