import { Component, OnInit } from "@angular/core";
import { takeUntil } from "rxjs";
import { Router } from "@angular/router";

import { User } from "@auth/models/user.model"; 
import { Unsub } from "../../../core/unsub.class";
import { FriendService } from "../../services/friend.service";

@Component({
  selector: "app-my-network",
  templateUrl: "./my-network.component.html",
  styleUrls: ["./my-network.component.scss"],
})
export class MyNetworkComponent extends Unsub implements OnInit {
  friendList: User[] = [];
  popoverEvent: Event;
  isPopoverOpen: boolean = false;
  constructor(private friendService: FriendService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.friendService
      .getAllFriends()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((friendsList: User[]) => {
        this.friendList = friendsList;
      });
  }

  joinConversation(friendId: number) {
     this.router.navigate([`/home/chat/${friendId}`]);
  }

  presentPopover(event: Event) {
    this.isPopoverOpen = true;
    this.popoverEvent = event;
  }

  closePopover() {
    this.isPopoverOpen = false;
  }

  removeConnection(friendId: number) {
    this.friendService
      .deleteFriend(friendId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.friendList = this.friendList.filter(({ id }) => id !== friendId);
        this.closePopover();
      });
  }
}
