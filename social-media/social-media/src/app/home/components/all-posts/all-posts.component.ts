import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { InfiniteScrollCustomEvent, ModalController } from "@ionic/angular";
import { BehaviorSubject, catchError, of, takeUntil } from "rxjs";

import { AuthService } from "./../../../auth/services/auth.service";
import { PostService } from "../../services/post.service";
import { ModalComponent } from "../post/modal/modal.component";
import { User } from "../../../auth/models/user.model";
import { Unsub } from "../../../core/unsub.class";
import { Post } from "../../models/post.model";
import { ToastService } from "../../../core/toast.service";

@Component({
  selector: "app-all-posts",
  templateUrl: "./all-posts.component.html",
  styleUrls: ["./all-posts.component.scss"],
})
export class AllPostsComponent extends Unsub implements OnInit, OnChanges {
  @Input() postBody?: string;
  @Input() userId!: number;
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
    public modalController: ModalController,
    private toastService: ToastService
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
            .subscribe(({ imageUrl }) => {
              this.imageUrl = imageUrl;
            });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["userId"]) {
      const userChange = changes["userId"];
      this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;
      if (userChange.currentValue) {
        this.postService
          .getAllPosts(this.queryParams)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((posts: Post[]) => {
            for (let post = 0; post < posts.length; post++) {
              this.posts.push(posts[post]);
            }
            this.skipPosts += this.numberOfPosts;
          });
      }
    }
    if (!this.userId) {
      const postBody = changes["postBody"].currentValue;
      if (!postBody) return;
      this.postService
        .createPost(postBody)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((post: Post) => {
          this.posts.unshift(post);
        });
    }
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
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError(({ error }) => {
          this.toastService.presentToast(error.message);
          return of({ error: true });
        })
      )
      .subscribe(() => {
        this.posts = this.posts.filter((post: Post) => post.id !== postId);
      });
  }
}
