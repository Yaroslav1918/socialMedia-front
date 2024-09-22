import { FriendRequest_Status } from "./status.model";
import { User } from "./user.model";

export interface FriendRequest {
  id: number;
  creator: User;
  receiver: User;
  status: FriendRequest_Status;
}
