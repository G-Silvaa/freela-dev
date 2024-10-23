import { Routes } from "@angular/router";
import { SidenavComponent } from "@core/layouts/sidenav/sidenav.component";
import { adminRoutes } from "@modules/administracao/administracao-routing.module";
import { ProcessosComponent } from "@modules/home/pages/campus/processos/processos.component";

export const routes: Routes = [
  {
    path: "",
    children: adminRoutes,
  },
  {
    path: "home",
    component: SidenavComponent,
    children: [
      {
        path: "",
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
    children: [
      {
        path: "processos",
        loadComponent: () =>
          import("./modules/home/pages/campus/processos/processos.component").then(
            (m) => m.ProcessosComponent,
          ),
       
      },
      {
        path: "contratos",
        loadComponent: () =>
          import(
            "./modules/home/pages/campus/contratos/contratos.component"
          ).then((m) => m.ContratosComponent),
        
      },

      {
        path: "clientes",
        loadComponent: () =>
          import("./modules/home/pages/campus/clientes/clientes.component").then(
            (m) => m.ClientesComponent,
          ),
      },
    ],
  },
];
