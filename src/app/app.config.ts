import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { WebReqInterceptor } from './web-req.interceptor';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
      provideRouter(routes),
      provideHttpClient(withInterceptorsFromDi()),  
      {
          provide:HTTP_INTERCEPTORS,
          useClass:WebReqInterceptor,
          multi:true
      }
  ]
};
