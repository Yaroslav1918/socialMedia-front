import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatService } from "../../../auth/services/chat.service";
import { BehaviorSubject, Subscription, takeUntil } from "rxjs";
import { User } from "../../../auth/models/user.model";
import { AuthService } from "../../../auth/services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Unsub } from "../../../core/unsub.class";
import { Message } from "../../../auth/models/message.model";
import { Conversation } from "../../../auth/models/conversation.model";
import { environment } from "../../../../environments/environment.prod";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent extends Unsub implements OnInit {
  friendList: User[] = [];
  friend: User;
  friend$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );
  selectedFriend: any;

  messages: Message[] = [];
  newMessage: string;

  selectedConversationIndex!: number;
  userId!: number;
  imageUrl!: string | null;
  friendImage!: string;

  conversations: Conversation[] = [];
  conversation: Conversation = {};

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
      console.log("dsfsd");
      let conversationUserIds = [this.userId, this.friend.id].sort();

      this.conversations.forEach((conversation: Conversation) => {
        let userIds = (conversation.users ?? [])
          .map((user: User) => user.id)
          .sort();

        if (JSON.stringify(conversationUserIds) === JSON.stringify(userIds)) {
          this.conversation = conversation;
        }
      });

      this.chatService.sendMessage(this.newMessage, this.conversation);
      this.newMessage = "";
    }
  }

  ngOnInit() {
    this.authService
      .getUserImage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((imageUrl: string | null) => {
        this.imageUrl = imageUrl;
      });

    this.chatService
      .getConversations()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((conversations: Conversation[]) => {
        this.conversations.push(conversations[0]);
      });
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
      .subscribe((message: Message) => {
        message.createdAt = new Date();
        const allMessageIds = this.messages.map(
          (message: Message) => message.id
        );
        if (!allMessageIds.includes(message.id)) {
          this.messages.push(message);
        }
        console.log(this.messages);
      });

    this.friend$.pipe(takeUntil(this.unsubscribe$)).subscribe((friend: any) => {
      if (friend !== null && this.friend.id) {
        this.chatService.joinConversation(this.friend.id);
      }
    });

    this.chatService
      .getAllFriends()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((friends: User[]) => {
        this.friendList = friends;
        this.handleRouteParams();
        if (friends.length > 0) {
          this.friend = this.friendList[0];
          this.friend$.next(this.friend);
          this.friendList.forEach((friend: User) => {
            this.loadFriendImage(friend.id);
          });
          friends.forEach((friend: User) => {
            this.chatService.createConversation(friend);
          });
          if (this.friend.id) {
            this.chatService.joinConversation(this.friend.id);
          }
        }
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

  loadFriendImage(userId: number) {
    this.authService
      .getUserImage(userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((imageUrl: string) => {
        this.friendImage = imageUrl;
      });
  }

  defineFullImagePath(user: User | undefined): string {
    if (!user) {
      return environment.defaultAvatar;
    }
    if (user.id === this.userId && this.imageUrl) {
      return this.imageUrl;
    }
    return user.imagePath ? this.friendImage : environment.defaultAvatar;
  }
}
