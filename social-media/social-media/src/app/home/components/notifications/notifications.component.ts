import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatService } from "../../../auth/services/chat.service";
import { Subscription, takeUntil } from "rxjs";
import { Unsub } from "../../../core/unsub.class";
import { UnifiedService } from "../../../auth/services/unified.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent extends Unsub implements OnInit {
  friendList: any[] = [];
  constructor(
    private chatService: ChatService,
    private unifiedService: UnifiedService
  ) {
    super();
  }

  ngOnInit(): void {
    this.chatService
      .getAllRequestsFriend()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((friendsList: any[]) => {
        this.friendList = friendsList.filter(
          (friend) => friend.status === "pending"
        );
      });
  }

  acceptRequest(receiverId: number) {
    this.chatService
      .updateRequestStatus(receiverId, "accepted")
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateFriendList(receiverId);
      });
  }

  declineRequest(receiverId: number) {
    this.chatService
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
    this.unifiedService.updateNotificationCount(this.friendList.length);
  }

}
