import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs";

import { User } from "../../../auth/models/user.model";
import { Unsub } from "../../../core/unsub.class";
import { PostService } from "../../services/post.service";

@Component({
  selector: "app-friend-profile",
  templateUrl: "./friend-profile.component.html",
  styleUrls: ["./friend-profile.component.scss"],
})
export class FriendProfileComponent extends Unsub implements OnInit {
  friend!: any;
  friendId: number = 0;
  queryParams!: string;
  numberOfPosts = 5;
  skipPosts = 0;

  constructor(private route: ActivatedRoute, private postService: PostService) {
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
      .subscribe((friend:any) => {
        this.friend = friend;
      });
  }
}
