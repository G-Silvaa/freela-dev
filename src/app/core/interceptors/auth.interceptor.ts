import { Injectable } from '@angular/core';
import { Cache } from '../adapters';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private readonly apiUrl = environment.apiUrl;
  private readonly publicEndpoints = ['/auth/login', '/auth/register'];

  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = Cache.getLocalStorage({ key: 'accessToken' });
    const isApiRequest = request.url.startsWith(this.apiUrl);
    const isPublicEndpoint = this.publicEndpoints.some((endpoint) =>
      request.url.includes(endpoint),
    );

    const authRequest = accessToken && isApiRequest && !isPublicEndpoint
      ? request.clone({
          headers: request.headers.set('Authorization', `Bearer ${accessToken}`),
        })
      : request;

    return next.handle(authRequest).pipe(
      catchError((error) => {
        if ((error.status === 401 || error.status === 403) && isApiRequest && !isPublicEndpoint) {
          Cache.removeLocalStorage({ key: 'accessToken' });
          Cache.removeLocalStorage({ key: 'authUser' });
          this.router.navigateByUrl('/login');
        }

        return throwError(() => error);
      })
    );
  }
}
