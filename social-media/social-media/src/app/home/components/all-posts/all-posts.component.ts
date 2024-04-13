import { AuthService } from "./../../../auth/services/auth.service";
import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { Post } from "../../models/post";
import { PostService } from "../../services/post.service";
import { InfiniteScrollCustomEvent, ModalController } from "@ionic/angular";
import { BehaviorSubject, take } from "rxjs";
import { ModalComponent } from "../post/modal/modal.component";

@Component({
  selector: "app-all-posts",
  templateUrl: "./all-posts.component.html",
  styleUrls: ["./all-posts.component.scss"],
})
export class AllPostsComponent implements OnInit {
  @Input() postBody?: string;
  posts: Post[] = [];
  queryParams!: string;
  numberOfPosts = 5;
  skipPosts = 0;
  userId$ = new BehaviorSubject<number | null>(null);

  constructor(
    private postService: PostService,
    private authService: AuthService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getPosts(false);
    this.authService.userId.pipe(take(1)).subscribe((userId: number | null) => {
      this.userId$.next(userId);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    const postBody = changes["postBody"].currentValue;
    if (!postBody) return;
    this.postService.createPost(postBody).subscribe((post: Post) => {
      this.posts.unshift(post);
    });
  }

  getPosts(isInitialLoad: Boolean, event?: InfiniteScrollCustomEvent) {
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;
    this.postService
      .getAllPosts(this.queryParams)
      .subscribe((posts: Post[]) => {
        if (posts.length === 0 || posts.length < this.numberOfPosts) {
          if (event) event.target.disabled = true;
        }
        for (let post = 0; post < posts.length; post++) {
          this.posts.push(posts[post]);
        }
        if (isInitialLoad) {
          event?.target.complete();
        }
        this.skipPosts += this.numberOfPosts;
      });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.getPosts(true, event);
  }

  async updatePost(postId: number, body: string) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: "modal",
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;
    this.postService.updatePost(data.post.body, postId).subscribe(() => {
    const index = this.posts.findIndex(post => post.id === postId);
    if (index !== -1) {
      this.posts[index].body = data.post.body;
    }
  })
}
  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe(() => {
      this.posts = this.posts.filter((post: Post) => post.id !== postId);
    });
  }
}
