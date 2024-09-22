import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take } from "rxjs";

import { environment } from "../../../environments/environment";
import { Post } from "../models/post.model";

@Injectable({
  providedIn: "root",
})
export class PostService {
  constructor(private http: HttpClient) {}

  createPost(body: string) {
    return this.http
      .post<Post>(`${environment.baseApiUrl}/posts`, { body })
      .pipe(take(1));
  }

  getAllPosts(params: string) {
    return this.http.get<Post[]>(`${environment.baseApiUrl}/posts${params}`);
  }

  getAllPostsByFriendId(
    userId: number,
    take: number = 5,
    skip: number = 0
  ): Observable<Post[]> {
    return this.http.get<Post[]>(
      `${environment.baseApiUrl}/posts/${userId}?take=${take}&skip=${skip}`
    );
  }

  updatePost(body: string, postId: number) {
    return this.http
      .put(`${environment.baseApiUrl}/posts/${postId}`, { body })
      .pipe(take(1));
  }

  deletePost(postId: number) {
    return this.http
      .delete(`${environment.baseApiUrl}/posts/${postId}`)
      .pipe(take(1));
  }
}
