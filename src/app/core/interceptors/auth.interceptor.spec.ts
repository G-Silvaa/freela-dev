import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { Router } from '@angular/router';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        Router,
      ],
    });

    interceptor = TestBed.inject(AuthInterceptor);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

});
