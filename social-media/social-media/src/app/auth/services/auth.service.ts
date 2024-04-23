import { environment } from "./../../../environments/environment.prod";
import { Injectable } from "@angular/core";
import { NewUser } from "../models/newUser.model";
import { HttpClient } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";

import {
  BehaviorSubject,
  Observable,
  from,
  map,
  of,
  switchMap,
  take,
  tap,
} from "rxjs";
import { User } from "../models/user.model";
import { UserResponse } from "../models/userResponse.model";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);
  private imageUrl$ = new BehaviorSubject<string | null>(null);
  constructor(private http: HttpClient, private router: Router) {
    this.getUserImage().subscribe((imageUrl: string | null) => {
      this.imageUrl$.next(imageUrl);
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
      .pipe(take(1));
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
        })
      );
  }

  isTokenInStorage(): Observable<boolean> {
    return of(localStorage.getItem("token")).pipe(
      map((token: string | null) => {
        if (!token) return false;
        const decodedToken: UserResponse = jwtDecode(token);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);
        if (isExpired) return false;
        if (decodedToken) {
          this.user$.next(decodedToken);
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    localStorage.removeItem("token");
    this.router.navigateByUrl("/auth/login");
  }

  uploadUserImage(
    formData: FormData
  ): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(
        `${environment.baseApiUrl}/users/upload`,
        formData
      )
      .pipe(take(1));
  }

  getUserImage() {
    return this.http
      .get(`${environment.baseApiUrl}/users/image`, {
        responseType: "blob",
      })
      .pipe(
        map((data) => {
          return URL.createObjectURL(data);
        }),
        take(1)
      );
  }

  setImageUrl(imageUrl: string) {
    this.imageUrl$.next(imageUrl);
  }
  // getImageUrl(): Observable<string | null> {
  //   return this.user$.pipe(
  //     take(1),
  //     map((user: User | null) => {
  //       return user && user.imagePath ? user.imagePath : null;
  //     })
  //   );
  // }

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
