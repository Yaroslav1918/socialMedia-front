import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { User } from "../models/user.model";
import { FriendRequest_Status } from "../models/status.model";
import { Message } from "../models/message.model";
import { Conversation } from "../models/conversation.model";
import { ChatSocketService } from "../../core/chat-socket.service";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  constructor(private socket: ChatSocketService, private http: HttpClient) {}

  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseApiUrl}/user/friends/my`);
  }

  joinConversation(friendId: number): void {
    this.socket.emit("joinConversation", friendId);
  }
  leaveConversation(): void {
    this.socket.emit("leaveConversation");
  }

  getConversationMessages(): Observable<Message[]> {
    return this.socket.fromEvent<Message[]>("messages");
  }

  getConversations(): Observable<Conversation[]> {
    return this.socket.fromEvent<Conversation[]>("conversations");
  }

  sendMessage(message: string, conversation: Conversation): void {
    const newMessage: Message = {
      message,
      conversation,
    };
    this.socket.emit("sendMessage", newMessage);
  }

  getNewMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>("newMessage");
  }
  createConversation(friend: User): void {
    console.log("🚀 ~ ChatService ~ createConversation ~ friend:", friend);
    this.socket.emit("createConversation", friend);
  }

  getAllFriends() {
    return this.http.get<User[]>(`${environment.baseApiUrl}/users/friends/all`);
  }

  searchFriendsByName(name: string): Observable<User[]> {
    return this.http.post<User[]>(`${environment.baseApiUrl}/users/search`, {
      name,
    });
  }
  sendFriendRequest(receiverId: number): Observable<any> {
    return this.http.post(
      `${environment.baseApiUrl}/users/friend-request/${receiverId}`,
      {}
    );
  }
  getAllRequestsFriend() {
    return this.http.get<any[]>(
      `${environment.baseApiUrl}/users/friend-request/received-requests`
    );
  }
  updateRequestStatus(
    receiverId: number,
    status: FriendRequest_Status
  ): Observable<any> {
    return this.http.put(
      `${environment.baseApiUrl}/users/friend-request/status/${receiverId}`,
      {
        status,
      }
    );
  }

  deleteFriend(friendId: number): Observable<any> {
    return this.http.delete(`${environment.baseApiUrl}/users/${friendId}`);
  }
}
