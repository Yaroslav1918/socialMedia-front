import { PopoverController } from "@ionic/angular";
import { AuthService } from "./../../../../auth/services/auth.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-popover",
  templateUrl: "./popover.component.html",
  styleUrls: ["./popover.component.scss"],
})
export class PopoverComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {}
  onSignOut() {
    this.authService.logout();
    this.dismissPopover();
  }

  dismissPopover() {
    this.popoverController.dismiss();
  }
}
