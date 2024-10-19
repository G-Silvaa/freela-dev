import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdministracaoRoutingModule} from "./administracao-routing.module";
import {UsuariosService} from "@modules/administracao/services/usuarios.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdministracaoRoutingModule
  ],
  providers: [
    UsuariosService
  ]
})
export class AdministracaoModule { }
