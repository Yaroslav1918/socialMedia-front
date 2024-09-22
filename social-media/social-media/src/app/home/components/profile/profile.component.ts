import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { BehaviorSubject, takeUntil } from "rxjs";

import { AuthService } from "../../../auth/services/auth.service";
import { User } from "../../../auth/models/user.model";
import { Unsub } from "../../../core/unsub.class";
import { FriendService } from "../../services/friend.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent extends Unsub implements OnInit, OnChanges {
  @Input() user: User | null = null;
  fileName: string = "";
  fullName: string = "";
  fullName$ = new BehaviorSubject<string>("");
  imageUrl: string = "";
  numberOfFriends: number = 0;
  friendId: number = 0;

  constructor(
    private authService: AuthService,
    private friendService: FriendService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["user"]) {
      const userChange = changes["user"];
      if (userChange.currentValue) {
        this.loadUserImage();
      }
    }
  }
  ngOnInit() {
    this.friendId = +this.route.snapshot.paramMap.get("id")!;
    if (this.friendId) {
      this.friendService
        .getFriendById(this.friendId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((friend: User) => {
          this.fullName = friend.firstName + " " + friend.lastName;
        });
    } else {
      this.authService.userFullName
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((fullName: string) => {
          if (!this.user) {
            this.fullName = fullName;
            this.fullName$.next(fullName);
          } else {
            this.fullName = this.user.firstName + " " + this.user.lastName;
          }
        });
    }

    this.friendService
      .getAllFriends()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((friendsList: User[]) => {
        this.numberOfFriends = friendsList.length;
      });
    this.loadUserImage();
  }

  private loadUserImage(): void {
    if (this.friendId) {
      this.authService
        .getUserImage(this.friendId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((fullImagePath: string) => {
          this.imageUrl = fullImagePath;
        });
      return;
    }

    if (this.user) {
      this.authService
        .getUserImage(this.user.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((fullImagePath: string) => {
          this.imageUrl = fullImagePath;
        });
      return;
    }
    this.authService
      .getUserImage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((fullImagePath: string) => {
        this.imageUrl = fullImagePath;
      });
  }

  onFileSelect(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file);
      this.authService
        .uploadUserImage(formData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.authService
            .getUserImage()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((imageUrl: string) => {
              this.imageUrl = imageUrl;
              this.authService.setImageUrl(imageUrl);
            });
        });
    }
  }
}
