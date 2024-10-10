import { User } from "../../auth/models/user.model";
import { Conversation } from "./conversation.model";

export interface Message {
  id?: number;
  message: string;
  user: User;
  conversation?: Conversation;
  createdDate?: Date;
  read: Boolean;
}
