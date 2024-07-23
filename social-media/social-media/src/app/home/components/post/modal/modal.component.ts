import { ViewChild, OnInit, Component, OnDestroy } from "@angular/core";
import { OverlayEventDetail } from "@ionic/core/components";
import { NgForm } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { AuthService } from "../../../../auth/services/auth.service";
import { Subscription, takeUntil } from "rxjs";
import { Unsub } from "../../../../core/unsub.class";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent extends Unsub implements OnInit {
  @ViewChild("form") form!: NgForm;
  imageUrl!: string | null;
  constructor(
    public modalController: ModalController,
    private authService: AuthService
  ) {
    super();
  }
  ngOnInit() {
    this.authService
      .getImageUrl()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((imageUrl: string | null) => {
        this.imageUrl = imageUrl;
      });
  }

  onDismiss() {
    this.modalController.dismiss(null, "dismiss");
  }

  onSubmit() {
    if (!this.form.valid) return;
    const body = this.form.value["body"];

    this.modalController.dismiss(
      {
        post: {
          body,
        },
      },
      "post"
    );
  }
}
