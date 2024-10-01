import { PopoverController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";

import { AuthService } from "./../../../../auth/services/auth.service";
import { map, takeUntil } from "rxjs";
import { Unsub } from "../../../../core/unsub.class";
import { UnreadMessages } from "../../../models/unreadMessages.model";
import { FriendRequest } from "../../../../auth/models/friendRequest.model";
import { ChatService } from "../../../services/chat.service";
import { FriendService } from "../../../services/friend.service";

@Component({
  selector: "app-popover",
  templateUrl: "./popover.component.html",
  styleUrls: ["./popover.component.scss"],
})
export class PopoverComponent extends Unsub implements OnInit {
  imageUrl: string | null = null;
  unreadMessageCount: number = 0;
  friendRequestCount: number = 0;
  userId: number = 0;

  fullName = "";

  constructor(
    private authService: AuthService,
    private popoverController: PopoverController,
    private chatService: ChatService,
    private friendService: FriendService
  ) {
    super();
  }

  ngOnInit() {
    this.authService.userId
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((id) => {
        if (id !== null) {
          this.userId = id;
        }
      });
    this.authService.isUserLoggedIn
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.authService
            .getUserImage()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((imageUrl: string | null) => {
              this.imageUrl = imageUrl;
            });
        }
      });

    this.authService.userFullName
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
      });
    this.chatService
      .getUnreadMessages()
      .pipe(
        takeUntil(this.unsubscribe$),
        map(
          (messages: UnreadMessages[]) =>
            messages.filter((message) => !message.read).length
        )
      )
      .subscribe((count: number) => {
        this.unreadMessageCount = count;
      });

    this.friendService
      .getAllRequestsFriend()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((friendsList: FriendRequest[]) => {
        this.friendRequestCount = friendsList.filter(
          (friend) =>
            friend.status === "pending" && friend.creator.id !== this.userId
        ).length;
      });
  }

  onSignOut() {
    this.authService.logout();
    this.dismissPopover();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: "popover-header",
      event: ev,
      showBackdrop: false,
      backdropDismiss: true,
    });

    await popover.present();

    const popoverElement = await popover.querySelector("ion-content");
    if (popoverElement) {
      const focusableElement = popoverElement.querySelector(
        "[tabindex], button, a, input"
      );
      if (focusableElement) {
        (focusableElement as HTMLElement).focus();
      }
    }
  }

  dismissPopover() {
    this.popoverController.dismiss().then(() => {
      const triggerButton = document.getElementById("popover-trigger");
      if (triggerButton) {
        triggerButton.focus();
      }
    });
  }
}
