import { Component, OnInit } from "@angular/core";
import { takeUntil } from "rxjs";

import { Unsub } from "../../../core/unsub.class";
import { FriendService } from "../../services/friend.service";
import { User } from "../../../auth/models/user.model";
import { AuthService } from "../../../auth/services/auth.service";
import { FriendRequest } from "../../../auth/models/friendRequest.model";
import { Message } from "../../models/message.model";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent extends Unsub implements OnInit {
  friendList: FriendRequest[] = [];
  currentUserId: number = 0;
  unreadMessages: Message[] = [];

  constructor(
    private friendService: FriendService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.authService.userId
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((id: number | null) => {
        if (id !== null) {
          this.currentUserId = id;
        }
      });

    this.friendService
      .getAllRequestsFriend()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((friendsList: FriendRequest[]) => {
        this.friendList = friendsList.filter(
          (friend) =>
            friend.status === "pending" &&
            friend.creator.id !== this.currentUserId
        );
      });
  }

  acceptRequest(receiverId: number) {
    this.friendService
      .updateRequestStatus(receiverId, "accepted")
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateFriendList(receiverId);
      });
  }

  getFilteredUsers(conversationUsers?: User[]): User[] {
    return conversationUsers
      ? conversationUsers.filter((user) => user.id !== this.currentUserId)
      : [];
  }

  declineRequest(receiverId: number) {
    this.friendService
      .updateRequestStatus(receiverId, "declined")
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateFriendList(receiverId);
      });
  }

  updateFriendList(receiverId: number) {
    this.friendList = this.friendList.filter(
      (friend) => friend.id !== receiverId
    );
  }
}
