import { Component, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../../auth/models/user.model";
import { Subscription, takeUntil } from "rxjs";
import { ChatService } from "../../../auth/services/chat.service";
import { Router } from "@angular/router";
import { Unsub } from "../../../core/unsub.class";

@Component({
  selector: "app-my-network",
  templateUrl: "./my-network.component.html",
  styleUrls: ["./my-network.component.scss"],
})
export class MyNetworkComponent extends Unsub implements OnInit {
  friendList: User[] = [];
  popoverEvent: any;
  isPopoverOpen: boolean = false;
  constructor(private chatService: ChatService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.chatService
      .getAllFriends()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((friendsList: User[]) => {
        this.friendList = friendsList;
      });
  }

  joinConversation(friendId: number) {
    this.router.navigate(["/home/chat", { friendId }]);
  }

  presentPopover(event: any, friend: any) {
    this.isPopoverOpen = true;
    this.popoverEvent = event;
  }

  closePopover() {
    this.isPopoverOpen = false;
  }

  removeConnection(friendId: number) {
    this.chatService
      .deleteFriend(friendId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.friendList = this.friendList.filter(({ id }) => id !== friendId);
        this.closePopover();
      });
  }
}
