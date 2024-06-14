import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn:'root'
})

export class WebReqInterceptor implements HttpInterceptor {

  refeshingAccessToken :boolean | undefined 

  constructor(private authService: AuthService , private router : Router) { }

  
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    request = this.addAuthHeader(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401 && !this.refeshingAccessToken) {

         return this.refreshAccessToken().pipe(
            switchMap(() => {
              request = this.addAuthHeader(request) ;
              return next.handle(request);
            }),
            catchError((error:any) => {
               console.log(error);
               this.authService.logout();
               return EMPTY
            })
          )
          // this.router.navigate(['/login']);
        }
        // alert('Email already exists');
        return throwError(() => error);
      })
    );
  }

  refreshAccessToken() {
    this.refeshingAccessToken = true
    return this.authService.getNewAccessToken().pipe(
      tap(() => {
        this.refeshingAccessToken =false
        console.log('access token refresh');
      })
    )
  }

  addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getAccessToken();
    
    if (token) {
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      });
    }
    return request;
  }
}
