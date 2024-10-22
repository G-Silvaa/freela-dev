import { Routes } from "@angular/router";
import { SidenavComponent } from "@core/layouts/sidenav/sidenav.component";
import { adminRoutes } from "@modules/administracao/administracao-routing.module";
import { CursosComponent } from "@modules/home/pages/campus/cursos/cursos.component";

export const routes: Routes = [
  {
    path: "",
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
        path: "cursos",
        loadComponent: () =>
          import("./modules/home/pages/campus/cursos/cursos.component").then(
            (m) => m.CursosComponent,
          ),
        data: {
          title: "Cursos",
          description:
            "Cadastre, edite, exclua ou consulte os cursos do campus",
        },
      },
      {
        path: "grupo-acesso",
        loadComponent: () =>
          import(
            "./modules/home/pages/campus/grupo-de-acesso/grupo-de-acesso.component"
          ).then((m) => m.GrupoDeAcessoComponent),
        data: {
          title: "Grupo de Acesso",
          description:
            "Cadastre, edite, exclua ou consulte os cursos do campus",
        },
      },

      {
        path: "colaboradores",
        loadComponent: () =>
          import("./modules/home/pages/campus/pessoas/pessoas.component").then(
            (m) => m.PessoasComponent,
          ),
        data: {
          title: "Pessoas",
          description:
            "Cadastre, edite, exclua ou consulte os cursos do campus",
        },
      },
    ],
  },

  {
    path: "admin",
    children: adminRoutes,
  },
];
