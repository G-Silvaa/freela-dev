import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CadastrarComponent as CadastrarUsuario, ListarComponent as ListarUsuario} from "./pages/usuarios";
import {CadastrarComponent as CadastrarBloco, ListarComponent as ListarBlocos} from "./pages/blocos";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'usuarios',
    pathMatch: 'full',
  },
  {
    path: 'usuarios',
    component: ListarUsuario
  },
  {
    path: 'usuarios/novo',
    component: CadastrarUsuario
  },
  {
    path: 'blocos',
    component: ListarBlocos
  },
  {
    path: 'blocos/novo',
    component: CadastrarBloco
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoRoutingModule { }
