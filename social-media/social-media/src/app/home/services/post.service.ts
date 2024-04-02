import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../models/post";
import { environment } from "../../../environments/environment";
import { take } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PostService {
  constructor(private http: HttpClient) {}

  createPost(body: string) {
    return this.http.post<Post>(`${environment.baseApiUrl}/posts`, { body }).pipe(take(1));
  }

  getAllPosts(params: string) {
    return this.http.get<Post[]>(`${environment.baseApiUrl}/posts${params}`);
  }

  updatePost(body: string, postId: number) {
    return this.http
      .put(`${environment.baseApiUrl}/posts${postId}`, { body })
      .pipe(take(1));
  }

 deletePost(postId: number) {
    return this.http
      .delete(`${environment.baseApiUrl}/posts${postId}`)
      .pipe(take(1));
  }
}
