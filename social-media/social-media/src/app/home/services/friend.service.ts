import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { User } from "../../auth/models/user.model";
import { FriendRequest_Status } from "../../auth/models/status.model";

@Injectable({
  providedIn: "root",
})
export class FriendService {
  constructor(private http: HttpClient) {}

  getFriendById(friendId: number): Observable<User> {
    return this.http.get<User>(`${environment.baseApiUrl}/users/${friendId}`);
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
