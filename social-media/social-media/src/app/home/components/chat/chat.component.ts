import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatService } from "../../../auth/services/chat.service";
import { Subscription, takeUntil } from "rxjs";
import { User } from "../../../auth/models/user.model";
import { AuthService } from "../../../auth/services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Unsub } from "../../../core/unsub.class";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent extends Unsub implements OnInit {
  friendList: User[] = [];
  selectedFriend: any;
  messages: string[] = [];
  newMessage!: string;
  selectedConversationIndex!: number;
  userId!: number;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    super();
  }

  selectFriend(friend: User, i: number) {
    this.selectedFriend = friend;
    this.selectedConversationIndex = i;
    this.messages = [];
    this.chatService.joinConversation(this.selectedFriend.id);
  }

  sendMessage() {
    if (this.newMessage && this.selectedFriend) {
      this.chatService.sendMessage(
        this.userId,
        this.selectedFriend.id,
        this.newMessage
      );
      this.newMessage = "";
    }
  }

  ngOnInit() {
    this.authService.userId
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((id) => {
        if (id !== null) {
          this.userId = id;
        }
      });
    this.chatService
      .getNewMessage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((message) => {
        this.messages.push(message);
      });
    this.chatService
      .getAllFriends()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((friendsList: User[]) => {
        this.friendList = friendsList;
        this.handleRouteParams();
      });
  }

  handleRouteParams() {
    const friendId = +this.route.snapshot.params["friendId"];
    if (this.friendList.length > 0) {
      this.selectedFriend = this.friendList.find(
        (friend) => friend.id === friendId
      );
      if (this.selectedFriend) {
        this.selectFriend(
          this.selectedFriend,
          this.friendList.indexOf(this.selectedFriend)
        );
      }
    }
  }
}
