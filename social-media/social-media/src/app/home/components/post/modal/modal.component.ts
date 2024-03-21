import { ViewChild, OnInit, Component } from "@angular/core";
import { OverlayEventDetail } from "@ionic/core/components";
import { NgForm } from "@angular/forms";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  @ViewChild("form") form!: NgForm;

  constructor(public modalController: ModalController) {}
  ngOnInit() {}
  


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
