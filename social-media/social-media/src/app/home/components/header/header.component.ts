import { AuthService } from "./../../../auth/services/auth.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { IonPopover, PopoverController } from "@ionic/angular";
import { PopoverComponent } from "./popover/popover.component";
import { takeUntil } from "rxjs";
import { ChatService } from "../../../auth/services/chat.service";
import { User } from "../../../auth/models/user.model";
import { Unsub } from "../../../core/unsub.class";
import { UnifiedService } from "../../../auth/services/unified.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent extends Unsub implements OnInit {
  imageUrl!: string | null;
  numberOfNotifications = 0;
  searchQuery!: string;
  @ViewChild("popover") popover!: IonPopover;

  isOpen = false;
  constructor(
    public popoverController: PopoverController,
    public authService: AuthService,
    private unifiedService: UnifiedService,
    private chatService: ChatService
  ) {
    super();
  }

  ngOnInit() {
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
          this.chatService
            .getAllRequestsFriend()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((friendsList: any[]) => {
              this.numberOfNotifications = friendsList.filter(
                (friend) => friend.status === "pending"
              ).length;
            });
          this.unifiedService.notificationCount$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((count: number) => {
              this.numberOfNotifications = count;
            });
        }
      });

    //     if (isLoggedIn) {
    //       this.imageUrlSubscription = this.authService
    //         .getImageUrl()
    //         .subscribe((imageUrl: string | null) => {
    //           console.log(
    //             "🚀 ~ HeaderComponent ~ .subscribe ~ imageUrl:",
    //             imageUrl
    //           );
    //           this.imageUrl = imageUrl;
    //         });

    //       this.friendNotificationsSubscription = this.chatService
    //         .getAllRequestsFriend()
    //         .subscribe((friendsList: any[]) => {
    //           this.numberOfNotifications = friendsList.filter(
    //             (friend) => friend.status === "pending"
    //           ).length;
    //         });
    //     }
    //   }
    // );
  }
  presentFriendsPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: "popover-header",
      event: ev,
      showBackdrop: false,
    });
    await popover.present();
  }

  searchFriends(event: any) {
    const query = event.target.value;
    this.searchQuery = query;
    if (query) {
      this.presentFriendsPopover(event);
    }
    this.chatService
      .searchFriendsByName(query)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((friends: User[]) =>
        this.unifiedService.updateSearchQuery(friends)
      );
  }
}
