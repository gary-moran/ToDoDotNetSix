import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalReturn, ModalType } from '../shared/components/modal-dialog/modal-dialog.component';
import { AuthenticationService } from '../shared/services/authentication.service';
import { ModalDialogService } from '../shared/services/modal-dialog.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  constructor(private authenticationService: AuthenticationService, private router: Router, private modalDialogService: ModalDialogService) { }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  async logout() {
    if (this.authenticationService.isAuthenticated()) {
      if (await this.modalDialogService.callModalDialog(ModalType.YesNo, "Are you sure you wish to logout?") == ModalReturn.Yes) {
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
      }
    }
  }
}
