import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePage } from "./home.page";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ChatComponent } from "./components/chat/chat.component";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { MyNetworkComponent } from "./components/my-network/my-network.component";
import { GuestGuard } from "../auth/guards/guest.guard";

const routes: Routes = [
  {
    path: "",
    component: HomePage,
    children: [
      { path: "", component: WelcomeComponent, canActivate: [GuestGuard] },
      {
        path: "chat",
        component: ChatComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "feed",
        component: UserProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "notifications",
        component: NotificationsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "networks",
        component: MyNetworkComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
