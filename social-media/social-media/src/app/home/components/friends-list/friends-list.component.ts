import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { catchError, Observable, of, takeUntil } from "rxjs";
import { User } from "../../../auth/models/user.model";
import { ChatService } from "../../../auth/services/chat.service";
import { Unsub } from "../../../core/unsub.class";
import { ToastService } from "../../../core/toast.service";
import { PopoverController } from "@ionic/angular";

@Component({
  selector: "app-friends-list",
  templateUrl: "./friends-list.component.html",
  styleUrls: ["./friends-list.component.scss"],
})
export class FriendsListComponent extends Unsub implements OnInit, OnChanges {
  @Input() searchQuery!: string;
  connectedFriends: Set<number> = new Set<number>();
  friends$!: Observable<User[]>;

  constructor(
    private chatService: ChatService,
    private toastService: ToastService,
    private popoverController: PopoverController
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["searchQuery"] && this.searchQuery) {
      this.friends$ = this.chatService.searchFriendsByName(this.searchQuery);
    }
  }

  connectFriend(friendId: number) {
    this.chatService
      .sendFriendRequest(friendId)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError(({ error }) => {
          this.toastService.presentToast(error.message);
          return of({ error: true });
        })
      )
      .subscribe(({ error }) => {
        if (!error) {
          this.connectedFriends.add(friendId);
        }
        setTimeout(() => {
           this.popoverController.dismiss();
        }, 1000); 
      
      });
  }

  isConnected(friendId: number): boolean {
    return this.connectedFriends.has(friendId);
  }
  ngOnInit() {}
}
