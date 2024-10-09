import { Component, OnInit, ViewChild } from "@angular/core";
import { IonPopover, PopoverController } from "@ionic/angular";
import { map, takeUntil } from "rxjs";

import { Unsub } from "../../../core/unsub.class";
import { FriendService } from "../../services/friend.service";
import { ChatService } from "../../services/chat.service";
import { FriendResponse } from "../../../auth/models/friendResponse.model";
import { AuthService } from "./../../../auth/services/auth.service";
import { PopoverComponent } from "./popover/popover.component";
import { UnreadMessages } from "../../models/unreadMessages.model";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent extends Unsub implements OnInit {
  imageUrl: string | null = null;
  friendRequestCount: number = 0;
  unreadMessageCount: number = 0;
  userId: number = 0;
  searchQuery: string = "";
  isOpen: Boolean = false;
  @ViewChild("popover") popover!: IonPopover;

  constructor(
    public popoverController: PopoverController,
    public authService: AuthService,
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
            .userFullImagePath
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((imageUrl) => {
              this.imageUrl = imageUrl;
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
            .subscribe((friendsList: FriendResponse[]) => {
              this.friendRequestCount = friendsList.filter(
                (friend) =>
                  friend.status === "pending" &&
                  friend.creator.id !== this.userId
              ).length;
            });
        }
      });
  }
  presentFriendsPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  async presentPopover(ev: Event) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: "popover-header",
      event: ev,
      showBackdrop: false,
    });
    await popover.present();
  }

  searchFriends(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;
    if (query) {
      this.presentFriendsPopover(event);
    }
    this.friendService
      .searchFriendsByName(query)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }
}
