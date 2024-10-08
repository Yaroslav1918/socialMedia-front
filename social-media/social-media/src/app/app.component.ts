import { AuthService } from "./auth/services/auth.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { takeUntil } from "rxjs";

import { ChatService } from "./home/services/chat.service";
import { Unsub } from "./core/unsub.class";
import { ToastService } from "./core/toast.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent extends Unsub implements OnInit, OnDestroy {
  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    super();
  }

  ngOnInit() {
    this.authService.isUserLoggedIn
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (isLoggedIn) => {
        if (isLoggedIn) {
          try {
            await this.chatService.initializeSocket();
          } catch (error) {
            this.toastService.presentToast(
              "Unable to connect to chat. Please try again later."
            );
          }
        }
      });
  }
}
