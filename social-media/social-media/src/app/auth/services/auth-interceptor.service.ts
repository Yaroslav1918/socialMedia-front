import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";

import { Observable, from, of, switchMap } from "rxjs";

/** Pass untouched request through to the next request handler. */
@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return of(localStorage.getItem("token")).pipe(
      switchMap((token: string | null) => {
        if (token) {
          const clonedRequest = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + token),
          });
          return next.handle(clonedRequest);
        }
        return next.handle(req);
      })
    );
  }
}