import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AuthPageRoutingModule } from "./auth-routing.module";
import { AuthPage } from "./auth.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    HttpClientModule,
    RouterModule.forChild([{ path: "", component: AuthPage }]),
  ],
  declarations: [AuthPage],
})
export class AuthPageModule {}
