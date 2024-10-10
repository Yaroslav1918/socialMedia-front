import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Socket, SocketIoConfig } from "ngx-socket-io";
import { BehaviorSubject, EMPTY, Observable } from "rxjs";
import { Storage } from "@capacitor/storage";

import { Message } from "../models/message.model";
import { UnreadMessages } from "../models/unreadMessages.model";
import { Conversation } from "../models/conversation.model";
import { User } from "../../auth/models/user.model";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private socket: Socket | null = null;
  private socketInitialized$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}

  async initializeSocket() {
    if (this.socketInitialized$.value) {
      return;
    }
    const tokenData = await Storage.get({ key: "token" });
    const token = tokenData.value;
    if (token) {
      const config: SocketIoConfig = {
        url: "http://localhost:3000",
        options: {
          transportOptions: {
            polling: {
              extraHeaders: {
                Authorization: token,
              },
            },
          },
        },
      };

      this.socket = new Socket(config);
      this.socketInitialized$.next(true);
    } else {
      throw new Error("Token not available");
    }
  }

  emit(eventName: string, data?: any): void {
    this.socket?.emit(eventName, data);
  }

  fromEvent<T>(eventName: string): Observable<T> {
    if (!this.socket) {
      return EMPTY;
    }
    return this.socket.fromEvent<T>(eventName);
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.socketInitialized$.next(false);
  }

  joinConversation(friendId: number): void {
    this.emit("joinConversation", friendId);
  }

  leaveConversation(): void {
    this.emit("leaveConversation");
  }

  markMessagesAsRead(conversationId: number): void {
    this.emit("markMessagesAsRead", conversationId);
  }

  getUnreadMessagesCount(): Observable<number> {
    this.emit("getUnreadMessagesCount");
    return this.fromEvent<number>("unreadMessagesCount");
  }

  getUnreadMessages(): Observable<UnreadMessages[]> {
    this.emit("fetchUnreadMessages");
    return this.fromEvent<UnreadMessages[]>("unreadMessages");
  }

  getConversationMessages(): Observable<Message[]> {
    return this.fromEvent<Message[]>("messages");
  }

  getConversations(): Observable<Conversation[]> {
    return this.fromEvent<Conversation[]>("conversations");
  }

  sendMessage(message: string, conversation: Conversation, user: User): void {
    const newMessage: Message = {
      message,
      conversation,
      user,
      read: false,
    };
    this.emit("sendMessage", newMessage);
  }

  getNewMessage(): Observable<Message> {
    return this.fromEvent<Message>("newMessage");
  }

  fetchMessages(conversationId: number): Observable<Message[]> {
    this.emit("getMessages", conversationId);
    return this.fromEvent<Message[]>("messages");
  }

  createConversation(friend: User): void {
    this.emit("createConversation", friend);
  }

  onDeleteMessage(messageId: number): void {
    this.emit("removeMessage", messageId);
  }
}
