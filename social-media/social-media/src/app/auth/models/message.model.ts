import { Conversation } from "./conversation.model";
import { User } from "./user.model";

export interface Message {
  id?: number;
  message?: string;
  user?: User;
  conversation?: Conversation;
  createdAt?: Date;
}
