import { AuthService } from "./auth/services/auth.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { takeUntil } from "rxjs";

import { ChatService } from "./home/services/chat.service";
import { Unsub } from "./core/unsub.class";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent extends Unsub implements OnInit, OnDestroy {
  constructor(
    private chatService: ChatService,
    private authService: AuthService
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
            console.error("Failed to initialize chat service:", error);
          }
        }
      });
  }
}
