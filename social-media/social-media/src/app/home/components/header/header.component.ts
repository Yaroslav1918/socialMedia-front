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
  imageUrl!: string | null;
  constructor(
    public popoverController: PopoverController,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getImageUrl().subscribe((imageUrl: string | null) => {
      this.imageUrl = imageUrl;
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
  }
}
