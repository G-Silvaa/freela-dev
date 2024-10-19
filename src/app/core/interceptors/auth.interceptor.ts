import { Injectable } from '@angular/core';
import { Cache } from '../adapters';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = Cache.getSession({ key: 'accessToken' });

    if (accessToken) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`),
      });

      return next.handle(authRequest).pipe(
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            this.router.navigateByUrl('/');
          }
          return throwError(() => error);
        })
      );
    } else {
      this.router.navigateByUrl('/');
      return EMPTY;
    }
  }
}
