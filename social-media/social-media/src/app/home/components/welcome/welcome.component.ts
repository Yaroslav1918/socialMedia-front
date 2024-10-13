import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../../../auth/services/auth.service";
import { takeUntil } from "rxjs";
import { Unsub } from "../../../core/unsub.class";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent extends Unsub implements OnInit {
  @ViewChild("form") form!: NgForm;
  constructor(private authService: AuthService, private router: Router) {super()}

  ngOnInit() {}

  onSubmit() {
    const { email, password } = this.form.value;
    if (this.form) {
      this.authService
        .signIn(email, password)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.router.navigateByUrl("/home/feed");
        });
      this.form.reset();
    }
  }
}
