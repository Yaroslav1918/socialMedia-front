import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  @ViewChild("form") form!: NgForm;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  submissionType: "login" | "join" = "join";

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.submissionType = params["path"];
    });
  }

  onSubmit() {
    const { email, password, firstName, lastName } = this.form.value;
    if (this.submissionType === "login") {
      this.authService.signIn(email, password).subscribe(() => {
        this.router.navigateByUrl("/home/feed");
      });
    } else if (this.submissionType === "join") {
      const newUser = { firstName, lastName, email, password };
      this.authService.signUp(newUser).subscribe(() => this.toggleText());
    }
    this.form.reset();
  }

  toggleText() {
    this.submissionType = this.submissionType === "login" ? "join" : "login";
    this.router.navigate(["/auth", this.submissionType]);
  }
}
