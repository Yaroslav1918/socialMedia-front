import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../../../auth/services/auth.service";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
  @ViewChild("form") form!: NgForm;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    const { email, password } = this.form.value;
    if (this.form) {
      this.authService.signIn(email, password).subscribe(() => {
        this.router.navigateByUrl("/home/feed");
      });
      this.form.reset();
    }
  }
}
