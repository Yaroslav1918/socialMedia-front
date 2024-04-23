import { PopoverController } from "@ionic/angular";
import { AuthService } from "./../../../../auth/services/auth.service";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, take } from "rxjs";

@Component({
  selector: "app-popover",
  templateUrl: "./popover.component.html",
  styleUrls: ["./popover.component.scss"],
})
export class PopoverComponent implements OnInit {
  imageUrl!: string | null;
  fullName = "";

  constructor(
    private authService: AuthService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.authService.getImageUrl().subscribe((imageUrl: string | null) => {
      this.imageUrl = imageUrl;
    });
    this.authService.userFullName
      .pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
      });
  }
  onSignOut() {
    this.authService.logout();
    this.dismissPopover();
  }

  dismissPopover() {
    this.popoverController.dismiss();
  }
}
