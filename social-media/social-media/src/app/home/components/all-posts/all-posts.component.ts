import { AuthService } from "./../../../auth/services/auth.service";
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Post } from "../../models/post";
import { PostService } from "../../services/post.service";
import { InfiniteScrollCustomEvent, ModalController } from "@ionic/angular";
import { BehaviorSubject, Subscription, take, takeUntil } from "rxjs";
import { ModalComponent } from "../post/modal/modal.component";
import { User } from "../../../auth/models/user.model";
import { Unsub } from "../../../core/unsub.class";

@Component({
  selector: "app-all-posts",
  templateUrl: "./all-posts.component.html",
  styleUrls: ["./all-posts.component.scss"],
})
export class AllPostsComponent extends Unsub implements OnInit, OnChanges {
  @Input() postBody?: string;
  posts: Post[] = [];
  user: User | null = null;
  queryParams!: string;
  numberOfPosts = 5;
  skipPosts = 0;
  userId$ = new BehaviorSubject<number | null>(null);
  imageUrl!: string | null;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    public modalController: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.getPosts(false);
    this.authService.userId
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userId: number | null) => {
        this.userId$.next(userId);
      });
    this.authService
      .isTokenInStorage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.authService
            .getUserImage()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((imageUrl: string | null) => {
              this.imageUrl = imageUrl;
            });
        }
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    const postBody = changes["postBody"].currentValue;
    if (!postBody) return;
    this.postService
      .createPost(postBody)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((post: Post) => {
        this.posts.unshift(post);
      });
  }

  getPosts(isInitialLoad: Boolean, event?: InfiniteScrollCustomEvent) {
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;
    this.postService
      .getAllPosts(this.queryParams)
      .pipe(takeUntil(this.unsubscribe$))
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
    this.postService
      .updatePost(data.post.body, postId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        const index = this.posts.findIndex((post) => post.id === postId);
        if (index !== -1) {
          this.posts[index].body = data.post.body;
        }
      });
  }
  deletePost(postId: number) {
    this.postService
      .deletePost(postId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.posts = this.posts.filter((post: Post) => post.id !== postId);
      });
  }
}
