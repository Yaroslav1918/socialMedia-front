# LinkedIn Clone - Social Media App

This project is a LinkedIn clone, a social media platform where users can create, update, and delete posts, send messages in real-time, and manage their network. The app is built using **Ionic Framework** with Angular, and integrates  for user authentication and image storage in Firebase. **Socket.IO** is used for real-time messaging functionality.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Firebase Configuration](#firebase-configuration)
- [Deployed Links](#deployed-links)
- [Running the App](#running-the-app)


## Features

- **User Authentication**: Sign up, login.
- **Post Management**: Create, update, and delete posts (text).
- **Real-time Messaging**: Chat with other users in real time using **Socket.IO**.
- **Friend Network**: Add and manage connections (friend requests).
- **Image Storage**: Upload profile pictures  using Firebase Storage.
- **Responsive UI**: Optimized for both mobile and desktop using the Ionic framework.
- **Notifications**: Users receive notifications for new messages, friend requests, etc.

## Technologies Used

- **Ionic Framework**: Frontend framework for building cross-platform apps.
- **Angular**: Framework for building client-side web applications.
- **NestJS**: Backend framework for building scalable server-side applications on backend part.
- **PostgreSQL**: Database used for storing user data, posts, and messages.
- **Heroku**: Hosting platform for the backend services.
- **Firebase Storage**: Used exclusively for storing and managing user-uploaded images (profile pictures).
- **Socket.IO**: For real-time, bi-directional communication between the client and server (used for chat).
- **Capacitor**: For accessing native functionality on mobile devices.

## Deployed Links

- **Frontend**: Deployed on [Vercel](https://social-media-front-tmlm.vercel.app/home)
- **Backend**: Deployed on [Heroku](https://social-media-web-345f246ea60b.herokuapp.com/api) and powered by NestJS with a PostgreSQL database.

## Running the App
To run the project locally or on a mobile device, ensure all the necessary dependencies are installed by running:
npm install
To start the development server and run the app locally, use the following command:
ng serve

## Project Structure

```
social-media
├─ .browserslistrc
├─ .editorconfig
├─ .eslintrc.json
├─ .gitignore
├─ angular.json
├─ capacitor.config.ts
├─ ionic.config.json
├─ karma.conf.js
├─ package-lock.json
├─ package.json
├─ src
│  ├─ app
│  │  ├─ app-routing.module.ts
│  │  ├─ app.component.html
│  │  ├─ app.component.scss
│  │  ├─ app.component.ts
│  │  ├─ app.module.ts
│  │  ├─ auth
│  │  │  ├─ auth-routing.module.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.page.html
│  │  │  ├─ auth.page.scss
│  │  │  ├─ auth.page.ts
│  │  │  ├─ guards
│  │  │  │  ├─ auth.guard.ts
│  │  │  │  └─ guest.guard.ts
│  │  │  ├─ models
│  │  │  │  ├─ friendRequest.model.ts
│  │  │  │  ├─ role.model.ts
│  │  │  │  ├─ status.model.ts
│  │  │  │  ├─ user.model.ts
│  │  │  │  └─ userResponse.model.ts
│  │  │  └─ services
│  │  │     ├─ auth-interceptor.service.ts
│  │  │     └─ auth.service.ts
│  │  ├─ core
│  │  │  ├─ toast.service.ts
│  │  │  └─ unsub.class.ts
│  │  └─ home
│  │     ├─ components
│  │     │  ├─ advertising
│  │     │  │  ├─ advertising.component.html
│  │     │  │  ├─ advertising.component.scss
│  │     │  │  └─ advertising.component.ts
│  │     │  ├─ all-posts
│  │     │  │  ├─ all-posts.component.html
│  │     │  │  ├─ all-posts.component.scss
│  │     │  │  └─ all-posts.component.ts
│  │     │  ├─ chat
│  │     │  │  ├─ chat.component.html
│  │     │  │  ├─ chat.component.scss
│  │     │  │  └─ chat.component.ts
│  │     │  ├─ footer
│  │     │  │  ├─ footer.component.html
│  │     │  │  ├─ footer.component.scss
│  │     │  │  └─ footer.component.ts
│  │     │  ├─ friends-list
│  │     │  │  ├─ friends-list.component.html
│  │     │  │  ├─ friends-list.component.scss
│  │     │  │  └─ friends-list.component.ts
│  │     │  ├─ header
│  │     │  │  ├─ header.component.html
│  │     │  │  ├─ header.component.scss
│  │     │  │  ├─ header.component.ts
│  │     │  │  └─ popover
│  │     │  │     ├─ popover.component.html
│  │     │  │     ├─ popover.component.scss
│  │     │  │     └─ popover.component.ts
│  │     │  ├─ my-network
│  │     │  │  ├─ my-network.component.html
│  │     │  │  ├─ my-network.component.scss
│  │     │  │  └─ my-network.component.ts
│  │     │  ├─ notifications
│  │     │  │  ├─ notifications.component.html
│  │     │  │  ├─ notifications.component.scss
│  │     │  │  └─ notifications.component.ts
│  │     │  ├─ post
│  │     │  │  ├─ modal
│  │     │  │  │  ├─ modal.component.html
│  │     │  │  │  ├─ modal.component.scss
│  │     │  │  │  └─ modal.component.ts
│  │     │  │  ├─ post.component.html
│  │     │  │  ├─ post.component.scss
│  │     │  │  └─ post.component.ts
│  │     │  ├─ profile
│  │     │  │  ├─ profile.component.html
│  │     │  │  ├─ profile.component.scss
│  │     │  │  └─ profile.component.ts
│  │     │  ├─ user-profile
│  │     │  │  ├─ user-profile.component.html
│  │     │  │  ├─ user-profile.component.scss
│  │     │  │  └─ user-profile.component.ts
│  │     │  └─ welcome
│  │     │     ├─ welcome.component.html
│  │     │     ├─ welcome.component.scss
│  │     │     └─ welcome.component.ts
│  │     ├─ home-routing.module.ts
│  │     ├─ home.module.ts
│  │     ├─ home.page.html
│  │     ├─ home.page.scss
│  │     ├─ home.page.ts
│  │     ├─ models
│  │     │  ├─ conversation.model.ts
│  │     │  ├─ message.model.ts
│  │     │  ├─ newUser.model.ts
│  │     │  ├─ post.model.ts
│  │     │  └─ unreadMessages.model.ts
│  │     └─ services
│  │        ├─ chat.service.ts
│  │        ├─ friend.service.ts
│  │        └─ post.service.ts
│  ├─ assets
│  │  ├─ icon
│  │  │  └─ favicon.png
│  │  └─ shapes.svg
│  ├─ environments
│  │  ├─ environment.prod.ts
│  │  └─ environment.ts
│  ├─ global.scss
│  ├─ index.html
│  ├─ main.ts
│  ├─ polyfills.ts
│  ├─ test.ts
│  ├─ theme
│  │  └─ variables.scss
│  └─ zone-flags.ts
├─ tsconfig.app.json
├─ tsconfig.json
└─ tsconfig.spec.json

```