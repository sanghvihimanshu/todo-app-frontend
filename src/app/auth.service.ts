import { TaskService } from './task.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private taskService: TaskService , private router :Router,private http:HttpClient) { }

  login(email: string, password: string) : Observable<HttpResponse<any>>{
   
    return this.taskService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        const userId = res.body._id;
        const accessToken = res.headers.get('x-access-token');
        const refreshToken = res.headers.get('x-refresh-token');

        if (userId && accessToken && refreshToken) {
          this.setSession(userId, accessToken, refreshToken);
          
        } else {
          console.error('Missing required tokens in response');
        }
        
      })
    )
  }

  register(email: string, password: string) {
    return this.taskService.register(email, password);
  }

  logout() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() :string {
    return localStorage.getItem('x-refresh-token') || '';
  }

  getUserId() :string{
    return localStorage.getItem('user-id') || '';
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken)
  }

  private setSession(userId: string, accessToken: string, refreshToken: string) :void     {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  } 

   removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    const refreshToken = this.getRefreshToken();
    const userId = this.getUserId();
    return this.http.get(`${this.taskService.apiUrl}/user/me/access-token` , {
      headers: {
         'x-refresh-token': refreshToken,
        '_id' : this.getUserId()
      },
      observe: 'response',
    }).pipe(
      tap((res:HttpResponse<any>) => {
        const accessToken = res.headers.get('x-access-token');
        if(accessToken) {
        this.setAccessToken(accessToken);
        }
      })
    )
  }
}