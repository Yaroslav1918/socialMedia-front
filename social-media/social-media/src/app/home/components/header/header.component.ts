import { AuthService } from "./../../../auth/services/auth.service";
import { Component, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { PopoverComponent } from "./popover/popover.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isLoggedIn!: boolean;

  constructor(
    public popoverController: PopoverController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isTokenInStorage().subscribe((loggedIn: boolean) => {
      console.log(
        "🚀 ~ HeaderComponent ~ this.authService.isTokenInStorage().subscribe ~ loggedIn:",
        loggedIn
      );
      this.isLoggedIn = loggedIn;
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: "my-custom-class",
      event: ev,
      showBackdrop: false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log("onDidDismiss resolved with role", role);
  }
}
