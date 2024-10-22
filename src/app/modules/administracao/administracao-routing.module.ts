import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
  CadastrarComponent as CadastrarUsuario,
  ListarComponent as ListarUsuario,
} from "./pages/usuarios";
import {
  CadastrarComponent as CadastrarBloco,
  ListarComponent as ListarBlocos,
} from "./pages/blocos";
import { LoginComponent } from "./pages/login/login.component";

export const adminRoutes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  // {
  //   path: "usuarios",
  //   component: ListarUsuario,
  // },
  // {
  //   path: "usuarios/novo",
  //   component: CadastrarUsuario,
  // },
  // {
  //   path: "blocos",
  //   component: ListarBlocos,
  // },
  // {
  //   path: "blocos/novo",
  //   component: CadastrarBloco,
  // },
  {
    path: "login",
    component: LoginComponent,
  },
];
