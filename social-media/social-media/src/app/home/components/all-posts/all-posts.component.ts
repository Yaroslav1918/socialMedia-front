import { Component, OnInit } from "@angular/core";
import { Post } from "../../models/post";
import { PostService } from "../../services/post.service";
import { InfiniteScrollCustomEvent } from "@ionic/angular";

@Component({
  selector: "app-all-posts",
  templateUrl: "./all-posts.component.html",
  styleUrls: ["./all-posts.component.scss"],
})
export class AllPostsComponent implements OnInit {
  Posts: Post[] = [];
  queryParams!: string;
  numberOfPosts = 5;
  skipPosts = 0;
  loadingPosts = false;
  noMorePosts = false;
  constructor(private postService: PostService) {}

  ngOnInit() {
    console.log(this.Posts.length)
    this.getPosts(false);
  }

  getPosts(isInitialLoad: Boolean, event?: InfiniteScrollCustomEvent) {
     if (this.noMorePosts || this.loadingPosts) {
       return; 
     }
  
    this.loadingPosts = true; 
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;
    this.postService
      .getAllPosts(this.queryParams)
      .subscribe((posts: Post[]) => {
        if (posts.length === 0 || posts.length < this.numberOfPosts) {
          this.noMorePosts = true; 
        }
        for (let post = 0; post < posts.length; post++) {
          this.Posts.push(posts[post]);
        }
        if (isInitialLoad) {
          event?.target.complete();
        }
        this.skipPosts += this.numberOfPosts; 
        this.loadingPosts = false; 
      });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.getPosts(true, event);
  }
}
