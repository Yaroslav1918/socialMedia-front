import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  @ViewChild("form") form!: NgForm;
  constructor() {}
  submissionType: "login" | "join" = "join";
  ngOnInit() {}
  onSubmit() {
    const { email, password, firstName, lastName } = this.form.value;
    if (this.submissionType === "login") {
      console.log(email, password);
    } else if (this.submissionType === "join") {
      const newUser = { firstName, lastName, email, password };
      console.log(newUser);
    }
    this.form.reset();
  }

  toggleText() {
    console.log(this.submissionType);
    this.submissionType = this.submissionType === "login" ? "join" : "login";
  }
}
