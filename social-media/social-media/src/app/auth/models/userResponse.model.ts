import { User } from "./user.model";

export interface UserResponse extends User  {
  exp: number;
  iat: number;
}
