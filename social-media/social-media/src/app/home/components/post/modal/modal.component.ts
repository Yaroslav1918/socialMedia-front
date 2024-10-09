import { ViewChild, OnInit, Component} from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { takeUntil } from "rxjs";

import { AuthService } from "../../../../auth/services/auth.service";
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
      .userFullImagePath
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
