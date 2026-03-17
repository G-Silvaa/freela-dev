import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { Cache } from '@core/adapters';
import {
  AuthResponse,
  AuthUser,
  LoginPayload,
  NivelUsuario,
  RegisterPayload,
} from '@core/interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly AUTH_USER_KEY = 'authUser';
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(
    Cache.getLocalStorage({ key: this.AUTH_USER_KEY }) ?? null,
  );

  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  get accessToken(): string | null {
    return Cache.getLocalStorage({ key: this.ACCESS_TOKEN_KEY }) ?? null;
  }

  isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }

  isAdmin(): boolean {
    return this.currentUserValue?.nivel === 'ADMINISTRADOR';
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}auth/login`, payload).pipe(
      tap((response) => this.persistSession(response)),
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}auth/register`, payload).pipe(
      tap((response) => this.persistSession(response)),
    );
  }

  refreshProfile(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.API_URL}auth/me`).pipe(
      tap((user) => {
        Cache.setLocalStorage({ key: this.AUTH_USER_KEY, value: user });
        this.currentUserSubject.next(user);
      }),
    );
  }

  logout(redirectToLogin: boolean = true): void {
    Cache.removeLocalStorage({ key: this.ACCESS_TOKEN_KEY });
    Cache.removeLocalStorage({ key: this.AUTH_USER_KEY });
    this.currentUserSubject.next(null);

    if (redirectToLogin) {
      this.router.navigate(['/login']);
    }
  }

  getNivelLabel(nivel: NivelUsuario | string | undefined): string {
    const labels: Record<string, string> = {
      ADMINISTRADOR: 'Administrador',
      GESTOR: 'Gestor',
      OPERADOR: 'Operador',
    };

    return nivel ? labels[nivel] ?? nivel : '';
  }

  private persistSession(response: AuthResponse): void {
    Cache.setLocalStorage({ key: this.ACCESS_TOKEN_KEY, value: response.accessToken });
    Cache.setLocalStorage({ key: this.AUTH_USER_KEY, value: response.user });
    this.currentUserSubject.next(response.user);
  }
}
