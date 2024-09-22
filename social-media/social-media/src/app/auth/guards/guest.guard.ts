import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, of } from "rxjs";
import { tap, switchMap, take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class GuestGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isUserLoggedIn.pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(["/home/feed"]);
          return of(false);
        }
        return of(true);
      })
    );
  }
}
