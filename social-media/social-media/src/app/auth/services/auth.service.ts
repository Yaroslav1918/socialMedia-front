import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";
import { Storage } from "@capacitor/storage";
import {
  BehaviorSubject,
  Observable,
  catchError,
  distinctUntilChanged,
  from,
  map,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
  throwError,
} from "rxjs";

import { UserResponse } from "../models/userResponse.model";
import { ToastService } from "../../core/toast.service";
import { ChatService } from "../../home/services/chat.service";
import { User } from "../models/user.model";
import { environment } from "./../../../environments/environment.prod";
import { NewUser } from "../../home/models/newUser.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);
  private imageUrl$ = new BehaviorSubject<string | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService,
    private chatService: ChatService
  ) {
    this.isTokenInStorage().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.getUserImage().subscribe((imageUrl: string | null) => {
          this.imageUrl$.next(imageUrl);
        });
      }
    });
  }

  public isTokenExist(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      distinctUntilChanged(),
      switchMap((user) => of(user !== null))
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
        tap(async (response: { access_token: string }) => {
          await Storage.set({
            key: "token",
            value: response.access_token,
          });
          const decodedToken: UserResponse = jwtDecode(response.access_token);
          this.user$.next(decodedToken);
          this.isLoggedInSubject.next(true);
        }),
        catchError((error: any) => {
          this.toastService.presentToast(error.error.message);
          return throwError(() => error);
        })
      );
  }

  isTokenInStorage(): Observable<boolean> {
    return from(Storage.get({ key: "token" })).pipe(
      switchMap((tokenData) => {
        const token = tokenData.value;
        if (!token) return of(false);

        const decodedToken: UserResponse = jwtDecode(token);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);
        if (isExpired) return of(false);
        this.isLoggedInSubject.next(true);
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
    Storage.remove({ key: "token" });
    this.chatService.disconnect();
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
