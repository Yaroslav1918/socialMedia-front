import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs";

import { Unsub } from "../../../core/unsub.class";
import { PostService } from "../../services/post.service";
import { FriendService } from "../../services/friend.service";
import { User } from "../../../auth/models/user.model";

@Component({
  selector: "app-friend-profile",
  templateUrl: "./friend-profile.component.html",
  styleUrls: ["./friend-profile.component.scss"],
})
export class FriendProfileComponent extends Unsub implements OnInit {
  friend: User;
  friendId: number = 0;
  queryParams: string;
  numberOfPosts = 5;
  skipPosts = 0;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private friendService: FriendService
  ) {
    super();
  }

  ngOnInit(): void {
    this.friendId = +this.route.snapshot.paramMap.get("id")!;
    this.loadFriendProfile(this.friendId);
  }

  private loadFriendProfile(friendId: number): void {
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;
    this.postService
      .getAllPosts(this.queryParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
    this.friendId &&
      this.friendService
        .getFriendById(this.friendId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((friend: User) => {
          this.friend = friend;
        });
  }
}
