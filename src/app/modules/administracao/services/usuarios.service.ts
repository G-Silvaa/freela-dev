import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import {
  AuthUser,
  NivelUsuarioOption,
  UsuarioCreatePayload,
  UsuarioUpdatePayload,
} from '@core/interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly API_URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<AuthUser[]> {
    return this.http.get<AuthUser[]>(`${this.API_URL}usuarios`);
  }

  listarNiveis(): Observable<NivelUsuarioOption[]> {
    return this.http.get<NivelUsuarioOption[]>(`${this.API_URL}usuarios/niveis`);
  }

  criar(payload: UsuarioCreatePayload): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.API_URL}usuarios`, payload);
  }

  atualizar(id: number, payload: UsuarioUpdatePayload): Observable<AuthUser> {
    return this.http.patch<AuthUser>(`${this.API_URL}usuarios/${id}`, payload);
  }

  carregarPainelUsuarios(): Observable<{ usuarios: AuthUser[]; niveis: NivelUsuarioOption[] }> {
    return forkJoin({
      usuarios: this.listar(),
      niveis: this.listarNiveis(),
    });
  }
}
