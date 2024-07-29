import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private searchQuerySource = new BehaviorSubject<User[]>([]);
  searchQuery$ = this.searchQuerySource.asObservable();

  updateSearchQuery(friends: User[]) {
    this.searchQuerySource.next(friends);
  }
}
