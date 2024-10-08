import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { takeUntil } from "rxjs";

import { ModalComponent } from "./modal/modal.component";
import { AuthService } from "../../../auth/services/auth.service";
import { Unsub } from "../../../core/unsub.class";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],
})
export class PostComponent extends Unsub implements OnInit {
  @Output() create: EventEmitter<string> = new EventEmitter();
  imageUrl: string | null = null;
  fullName = "";
  canEmitCreate: boolean = true;

  constructor(
    private modalController: ModalController,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.authService.userFullImagePath
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((imageUrl: string | null) => {
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
