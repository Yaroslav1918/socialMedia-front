import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
  @ViewChild("form") form!: NgForm
  constructor() {}

  ngOnInit() {}

  onSubmit() {
    if (this.form) {
      console.log(this.form.value);
    }
  }
}
