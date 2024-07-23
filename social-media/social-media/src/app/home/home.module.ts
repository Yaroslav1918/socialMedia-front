import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { PopoverComponent } from './components/header/popover/popover.component';
import { PostComponent } from './components/post/post.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ModalComponent } from './components/post/modal/modal.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { ChatComponent } from './components/chat/chat.component';
import { FriendsListComponent } from './components/friends-list/friends-list.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { MyNetworkComponent } from "./components/my-network/my-network.component";



@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [
    HomePage,
    HeaderComponent,
    PopoverComponent,
    PostComponent,
    AdvertisingComponent,
    ProfileComponent,
    ModalComponent,
    WelcomeComponent,
    FooterComponent,
    UserProfileComponent,
    AllPostsComponent,
    ChatComponent,
    FriendsListComponent,
    NotificationsComponent,
    MyNetworkComponent
  ],
})
export class HomePageModule {}
