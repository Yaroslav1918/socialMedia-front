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
  of,
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

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public user$ = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService,
    private chatService: ChatService
  ) {
    this.initializeUser();
  }

  private async initializeUser() {
    const user = await Storage.get({ key: "user" });
    const storedUser: UserResponse = user.value ? JSON.parse(user.value) : null;
    if (storedUser) {
      this.user$.next(storedUser);
    }
  }

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      distinctUntilChanged(),
      switchMap((user) => of(user !== null))
    );
  }

  get userId(): Observable<number | null> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        return of(user?.id ?? null);
      })
    );
  }

  signUp(newUser: FormData): Observable<User> {
    return this.http
      .post<User>(`${environment.baseApiUrl}/auth/register`, newUser)
      .pipe(
        take(1),
        catchError((error) => {
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
          await Storage.set({
            key: "user",
            value: JSON.stringify(decodedToken),
          });

          this.user$.next(decodedToken);
          this.isLoggedInSubject.next(true);
        }),
        catchError((error) => {
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
        return of(true);
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    Storage.remove({ key: "token" });
    Storage.remove({ key: "user" });
    this.chatService.disconnect();
    this.router.navigateByUrl("/auth/login");
  }

  uploadUserImage(formData: FormData): Observable<{ imageUrl: string }> {
    return this.http.post<{ imageUrl: string }>(
      `${environment.baseApiUrl}/users/upload`,
      formData
    );
  }

  getUserImage(userId?: number): Observable<{ imageUrl: string }> {
    let url = `${environment.baseApiUrl}/users/image`;
    if (userId) {
      url += `?userId=${userId}`;
    }
    return this.http.get<{ imageUrl: string }>(url).pipe(take(1));
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
