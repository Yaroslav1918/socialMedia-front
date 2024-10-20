import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "./services/auth.service";
import { Unsub } from "../core/unsub.class";
import { takeUntil } from "rxjs";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage extends Unsub implements OnInit {
  @ViewChild("form") form!: NgForm;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }
  submissionType: "login" | "join" = "join";
  selectedFile: File | null = null;

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
      this.submissionType = params["path"];
    });
  }

  onSubmit() {
    const { email, password, firstName, lastName } = this.form.value;
    if (this.submissionType === "login") {
      this.authService
        .signIn(email, password)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.router.navigateByUrl("/home/feed");
        });
    } else if (this.submissionType === "join") {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      if (this.selectedFile) {
        formData.append("image", this.selectedFile);
      }

      this.authService
        .signUp(formData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => this.toggleText());
    }
    this.form.reset();
  }

  toggleText() {
    this.submissionType = this.submissionType === "login" ? "join" : "login";
    this.router.navigate(["/auth", this.submissionType]);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      this.selectedFile = file;
    }
  }
}
