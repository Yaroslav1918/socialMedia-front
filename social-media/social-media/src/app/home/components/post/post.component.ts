import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ModalComponent } from "./modal/modal.component";
import { AuthService } from "../../../auth/services/auth.service";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],
})
export class PostComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  imageUrl!: string | null;
  fullName = "";
  constructor(
    private modalController: ModalController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getImageUrl().subscribe((imageUrl: string | null) => {
      this.imageUrl = imageUrl;
    });
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: "modal",
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data) return;
    this.create.emit(data.post.body);
  }
}
