import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { Socket, SocketIoConfig } from "ngx-socket-io";
import { Observable, of, tap, throwError } from "rxjs";

const config: SocketIoConfig = {
  url: "http://localhost:3000",
  options: {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: localStorage.getItem("token"),
        },
      },
    },
  },
};
@Injectable({
  providedIn: "root",
})
export class ChatSocketService extends Socket {
    constructor() {
      super(config)
  }


}
