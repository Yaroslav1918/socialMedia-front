import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { BehaviorSubject, take, takeUntil } from "rxjs";
import { Storage } from "@capacitor/storage";

import { AuthService } from "../../../auth/services/auth.service";
import { User } from "@auth/models/user.model"; 
import { Unsub } from "../../../core/unsub.class";
import { FriendService } from "../../services/friend.service";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "../../../core/toast.service";
import { UserResponse } from "../../../auth/models/userResponse.model";

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
    private route: ActivatedRoute,
    private toastService: ToastService
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
        .subscribe(({ imageUrl }) => {
          this.imageUrl = imageUrl;
        });
      return;
    }

    if (this.user) {
      this.authService
        .getUserImage(this.user.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(({ imageUrl }) => {
          this.imageUrl = imageUrl;
        });
      return;
    }
    this.authService
      .getUserImage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ imageUrl }) => {
        this.imageUrl = imageUrl;
      });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validFileTypes.includes(file.type)) {
        this.toastService.presentToast(
          "Only JPEG, JPG, and PNG image formats are allowed."
        );
        return;
      }
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file);
      this.authService
        .uploadUserImage(formData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(async ({ imageUrl }) => {
          this.imageUrl = imageUrl;
          const user = await Storage.get({ key: "user" });
          const storedUser: UserResponse = user.value
            ? JSON.parse(user.value)
            : null;
          if (storedUser) {
            const updatedUser = { ...storedUser, imagePath: imageUrl };

            await Storage.set({
              key: "user",
              value: JSON.stringify(updatedUser),
            });
            this.authService.user$.next(updatedUser);
          }
        });
    }
  }
}
