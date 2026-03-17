import { Routes } from "@angular/router";
import { SidenavComponent } from "@core/layouts/sidenav/sidenav.component";
import { adminGuard, authGuard, guestGuard, routeAccessGuard } from "@core/guards/auth.guard";
import { adminRoutes } from "@modules/administracao/administracao-routing.module";

export const routes: Routes = [
  {
    path: "",
    canActivate: [guestGuard],
    children: adminRoutes,
  },
  {
    path: "",
    component: SidenavComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "home",
        canActivate: [routeAccessGuard('/home')],
        loadComponent: () =>
          import(
            "./modules/home/pages/initial-page/initial-page.component"
          ).then((m) => m.InitialPageComponent),
      },
    ],
  },
  {
    path: "",
    component: SidenavComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "processos",
        canActivate: [routeAccessGuard('/processos')],
        loadComponent: () =>
          import("./modules/home/pages/campus/processos/processos.component").then(
            (m) => m.ProcessosComponent,
          ),
      },
      {
        path: "contratos",
        canActivate: [routeAccessGuard('/contratos')],
        loadComponent: () =>
          import(
            "./modules/home/pages/campus/contratos/contratos.component"
          ).then((m) => m.ContratosComponent),
      },

      {
        path: "clientes",
        canActivate: [routeAccessGuard('/clientes')],
        loadComponent: () =>
          import("./modules/home/pages/campus/clientes/clientes.component").then(
            (m) => m.ClientesComponent,
          ),
      },
      {
        path: "modalidades",
        canActivate: [routeAccessGuard('/modalidades')],
        loadComponent: () =>
          import("./modules/home/pages/campus/modalidades/modalidades.component").then(
            (m) => m.ModalidadesComponent,
          ),
      },
      {
        path: "usuarios",
        canActivate: [adminGuard],
        loadComponent: () =>
          import("./modules/home/pages/campus/usuarios/usuarios.component").then(
            (m) => m.UsuariosComponent,
          ),
      },
      {
        path: "financas",
        canActivate: [routeAccessGuard('/financas')],
        loadComponent: () =>
          import("./modules/home/pages/campus/financas/financas.component").then(
            (m) => m.FinancasComponent,
          ),
      },
      {
        path: "",
        pathMatch: "full",
        redirectTo: "home",
      },
      {
        path: "**",
        redirectTo: "home",
      },
    ],
  },
];
