import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Storage } from "@capacitor/storage";
import { Observable, from,  switchMap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(Storage.get({ key: "token" })).pipe(
      switchMap((tokenData) => {
        const token = tokenData.value;
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