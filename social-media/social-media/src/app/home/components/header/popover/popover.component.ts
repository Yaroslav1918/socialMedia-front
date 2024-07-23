import { PopoverController } from "@ionic/angular";
import { AuthService } from "./../../../../auth/services/auth.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription, take, takeUntil } from "rxjs";
import { Unsub } from "../../../../core/unsub.class";

@Component({
  selector: "app-popover",
  templateUrl: "./popover.component.html",
  styleUrls: ["./popover.component.scss"],
})
export class PopoverComponent extends Unsub implements OnInit {
  imageUrl!: string | null;
  private userImageSubscription!: Subscription;
  fullName = "";

  constructor(
    private authService: AuthService,
    private popoverController: PopoverController
  ) {
    super();
  }

  ngOnInit() {
    this.authService
      .getImageUrl()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((imageUrl: string | null) => {
        this.imageUrl = imageUrl;
      });
    this.authService.userFullName
      .pipe(takeUntil(this.unsubscribe$))
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
