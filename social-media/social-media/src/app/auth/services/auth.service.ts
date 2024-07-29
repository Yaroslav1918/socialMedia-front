import { environment } from "./../../../environments/environment.prod";
import { Injectable } from "@angular/core";
import { NewUser } from "../models/newUser.model";
import { HttpClient } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";

import {
  BehaviorSubject,
  Observable,
  catchError,
  from,
  map,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from "rxjs";
import { User } from "../models/user.model";
import { UserResponse } from "../models/userResponse.model";
import { Router } from "@angular/router";
import { ToastService } from "../../core/toast.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);
  private imageUrl$ = new BehaviorSubject<string | null>(null);
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService
  ) {
    this.isTokenInStorage().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.getUserImage().subscribe((imageUrl: string | null) => {
          this.imageUrl$.next(imageUrl);
        });
      }
    });
  }

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user) => {
        return of(user !== null);
      })
    );
  }

  getImageUrl(): Observable<string | null> {
    return this.imageUrl$.asObservable();
  }
  get userId(): Observable<number | null> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        return of(user?.id ?? null);
      })
    );
  }

  signUp(newUser: NewUser): Observable<User> {
    return this.http
      .post<User>(`${environment.baseApiUrl}/auth/register`, newUser)
      .pipe(
        take(1),
        catchError((error: any) => {
          this.toastService.presentToast(error.error.message);
          return throwError(() => error);
        })
      );
  }

  signIn(
    email: string,
    password: string
  ): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(`${environment.baseApiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        take(1),
        tap((response: { access_token: string }) => {
          localStorage.setItem("token", response.access_token);
          const decodedToken: UserResponse = jwtDecode(response.access_token);
          this.user$.next(decodedToken);
        }),
        catchError((error: any) => {
          this.toastService.presentToast(error.error.message);
          return throwError(() => error);
        })
      );
  }

  isTokenInStorage(): Observable<boolean> {
    return of(localStorage.getItem("token")).pipe(
      switchMap((token: string | null) => {
        if (!token) return of(false);

        const decodedToken: UserResponse = jwtDecode(token);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);
        if (isExpired) return of(false);
        return this.getUserImage().pipe(
          tap((imageUrl: string | null) => {
            if (imageUrl && decodedToken) {
              const userWithImage: UserResponse = {
                ...decodedToken,
                imagePath: imageUrl,
              };
              this.user$.next(userWithImage);
            }
          }),
          map(() => true)
        );
      })
    );
  }
  logout(): void {
    this.user$.next(null);
    localStorage.removeItem("token");
    this.router.navigateByUrl("/auth/login");
  }

  uploadUserImage(formData: FormData): Observable<Blob> {
    return this.http
      .post(`${environment.baseApiUrl}/users/upload`, formData, {
        responseType: "blob",
      })
      .pipe(
        tap((response: Blob) => {
          let user = this.user$.value;
          if (user) {
            const urlImage = URL.createObjectURL(response);
            user.imagePath = urlImage;
            this.user$.next(user);
          }
        })
      );
  }

  getUserImage(userId?: number) {
    let url = `${environment.baseApiUrl}/users/image`;
    if (userId) {
      url += `?userId=${userId}`;
    }
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((data) => {
        return URL.createObjectURL(data);
      }),
      take(1)
    );
  }

  setImageUrl(imageUrl: string) {
    this.imageUrl$.next(imageUrl);
  }

  get userFullImagePath(): Observable<string | null> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        return user ? of(user.imagePath) : of(null);
      })
    );
  }

  get userFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        if (!user) {
          return of();
        }
        const fullName = user.firstName + " " + user.lastName;
        return of(fullName);
      })
    );
  }
}
