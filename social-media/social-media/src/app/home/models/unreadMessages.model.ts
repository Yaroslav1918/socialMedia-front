import { Conversation } from "./conversation.model";

export interface UnreadMessages {
  id: number;
  conversation: Conversation;
  createdDate: string;
  message: string;
  read: Boolean;
}
