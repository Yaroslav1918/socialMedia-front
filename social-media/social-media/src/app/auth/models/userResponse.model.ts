import { User } from "@auth/models/user.model";

export interface UserResponse extends User {
  exp: number;
  iat: number;
}
