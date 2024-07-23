import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../../auth/services/auth.service";
import { BehaviorSubject, Subscription, take, takeUntil } from "rxjs";
import { ChatService } from "../../../auth/services/chat.service";
import { User } from "../../../auth/models/user.model";
import { Unsub } from "../../../core/unsub.class";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent extends Unsub implements OnInit {
  fileName = "";
  fullName = "";
  fullName$ = new BehaviorSubject<string>("");
  imageUrl!: string;
  numberOfFriends = 0;

  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {
    super();
  }

  ngOnInit() {
    this.authService
      .getUserImage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((fullImagePath: string) => {
        this.imageUrl = fullImagePath;
      });
    this.authService.userFullName
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        this.fullName$.next(fullName);
      });
    this.chatService
      .getAllFriends()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((friendsList: User[]) => {
        this.numberOfFriends = friendsList.length;
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
