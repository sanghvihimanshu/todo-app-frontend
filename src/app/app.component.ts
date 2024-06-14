import { ReactiveFormsModule } from '@angular/forms';
import { Component, Injectable } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, RouterModule } from '@angular/router';
import { BoxComponent } from './box/box.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TaskService } from './task.service';
import { AuthService } from './auth.service';
import { WebReqInterceptor } from './web-req.interceptor';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterComponent } from './pages/register/register.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoxComponent, LoginPageComponent, RegisterComponent, RouterOutlet, RouterLink, RouterLinkActive, RouterModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WebReqInterceptor,
      multi: true
    },
    TaskService,
    AuthService
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'To-Do-App';
}
