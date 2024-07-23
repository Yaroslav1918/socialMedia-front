import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UnifiedService {
  private notificationCountSubject = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCountSubject.asObservable();
  private searchQuerySource = new BehaviorSubject<User[]>([]);
  searchQuery$ = this.searchQuerySource.asObservable();

  updateNotificationCount(count: number) {
    this.notificationCountSubject.next(count);
  }

  updateSearchQuery(friends: User[]) {
    this.searchQuerySource.next(friends);
  }
}
