import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePage } from "./home.page";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { AuthGuard } from "../auth/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: HomePage,
    children: [
      { path: "", component: WelcomeComponent, },
      { path: "feed", component: UserProfileComponent,  canActivate: [AuthGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
