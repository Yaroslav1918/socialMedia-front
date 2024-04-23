import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../../auth/services/auth.service";
import { BehaviorSubject, Subscription, take } from "rxjs";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  fileName = "";
  fullName = "";
  fullName$ = new BehaviorSubject<string>("");
  imageUrl!: string;
  constructor(private authService: AuthService) {}

  ngOnInit() {
     this.authService
      .getUserImage()
      .subscribe((fullImagePath: string) => {
        this.imageUrl = fullImagePath;
      });
    this.authService.userFullName
      .pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        this.fullName$.next(fullName);
      });
  }

  onFileSelect(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file);
      this.authService.uploadUserImage(formData).subscribe(() => {
        this.authService.getUserImage().subscribe((imageUrl: string) => {
          this.imageUrl = imageUrl;
          this.authService.setImageUrl(imageUrl);
        });
      });
    }
  }

}
