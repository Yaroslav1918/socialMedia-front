import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor(public toastController: ToastController) {}

  async presentToast(errorMessage: string) {
    const toast = await this.toastController.create({
      header: "Error occurred",
      message: errorMessage,
      duration: 2500,
      color: "danger",
      buttons: [
        {
          icon: "bug",
          text: "dismiss",
          role: "cancel",
        },
      ],
    });
    await toast.present();
  }
}
