import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, takeUntil } from "rxjs";

import { ChatService } from "../../services/chat.service";
import { User } from "../../../auth/models/user.model";
import { AuthService } from "../../../auth/services/auth.service";
import { Unsub } from "../../../core/unsub.class";
import { environment } from "../../../../environments/environment.prod";
import { FriendService } from "../../services/friend.service";
import { Message } from "../../models/message.model";
import { UnreadMessages } from "../../models/unreadMessages.model";
import { Conversation } from "../../models/conversation.model";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent extends Unsub implements OnInit, OnDestroy {
  friendList: User[] = [];
  friend: User;
  friend$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );
  selectedFriend?: User;
  messages: Message[] = [];
  newMessage: string;
  selectedConversationIndex: number;
  userId: number = 0;
  userImageUrl: string | null = null;
  unreadMessages: UnreadMessages[] = [];
  friendImage: string = "";
  conversations: Conversation[] = [];
  conversation: Conversation = {};

  constructor(
    private chatService: ChatService,
    private friendService: FriendService,
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
    this.setConversationForFriend();
    this.fetchMessagesForFriend();
    this.loadFriendImage(friend.id);
  }

  sendMessage() {
    if (this.newMessage && this.selectedFriend && this.conversation) {
      this.chatService.sendMessage(
        this.newMessage,
        this.conversation,
        this.selectedFriend
      );
      this.newMessage = "";
    }
  }

  private setConversationForFriend() {
    if (this.selectedFriend && this.userId) {
      let conversationUserIds = [this.userId, this.selectedFriend.id].sort();
      this.conversations.forEach((conversation: Conversation) => {
        let userIds = (conversation.users ?? [])
          .map((user: User) => user.id)
          .sort();

        if (JSON.stringify(conversationUserIds) === JSON.stringify(userIds)) {
          this.conversation = conversation;
        }
      });
    }
  }

  ngOnInit() {
    this.authService
      .getUserImage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userImageUrl: string | null) => {
        this.userImageUrl = userImageUrl;
      });

    this.chatService
      .getUnreadMessages()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((unreadMessages: UnreadMessages[]) => {
        this.unreadMessages = unreadMessages;
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
        message.createdDate = new Date();
        const allMessageIds = this.messages.map(
          (message: Message) => message.id
        );
        if (!allMessageIds.includes(message.id)) {
          this.messages.push(message);
        }
      });

    this.friend$.pipe(takeUntil(this.unsubscribe$)).subscribe((friend: any) => {
      if (friend !== null && this.friend.id) {
        this.chatService.joinConversation(this.friend.id);
      }
    });

    this.friendService
      .getAllFriends()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((friends: User[]) => {
        this.friendList = friends;
        this.handleRouteParams();
        if (friends.length > 0) {
          this.friend = this.friendList[0];
          this.friend$.next(this.friend);
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
  private fetchMessagesForFriend() {
    const conversationId = this.conversation.id!;
    this.chatService
      .fetchMessages(conversationId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((messages: Message[]) => {
        this.messages = messages;
        this.markMessagesAsRead();
      });
  }

  loadFriendImage(userId: number) {
    this.authService
      .getUserImage(userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userImageUrl: string) => {
        this.friendImage = userImageUrl;
      });
  }

  getUnreadMessageCountFromFriend(friend: User): number {
    return this.unreadMessages.filter(
      (message: UnreadMessages) =>
        !message.read &&
        message.conversation?.users?.some((user) => user.id === friend.id)
    ).length;
  }

  defineFullImagePath(user: User | undefined): string | null {
    if (!user) {
      return environment.defaultAvatar;
    }

    if (user.id === this.userId && this.userImageUrl) {
      return this.friendImage;
    }

    return user.imagePath ? this.userImageUrl : environment.defaultAvatar;
  }

  removeMessageFromList(messageId: number) {
    this.chatService.onDeleteMessage(messageId);
    this.messages = this.messages.filter((message) => message.id !== messageId);
  }

  markMessagesAsRead(): void {
    this.chatService.markMessagesAsRead(this.conversation.id!);
  }
}
