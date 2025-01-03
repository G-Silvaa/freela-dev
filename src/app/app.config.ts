import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { ModalModule } from "ngx-bootstrap/modal";
import { AuthInterceptor } from "@core/interceptors/auth.interceptor";
import { provideEnvironmentNgxMask } from "ngx-mask";
import { LucideAngularModule, House, Users, ClipboardList, FileChartColumnIncreasing, ArrowBigLeft, ArrowBigRight, ChevronsLeft, ChevronsRight } from "lucide-angular";

export const appConfig: ApplicationConfig = {
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true,
    // },
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(ModalModule.forRoot()),
    provideEnvironmentNgxMask(),
    importProvidersFrom(LucideAngularModule.pick({ House, Users, ClipboardList, FileChartColumnIncreasing, ArrowBigLeft, ArrowBigRight, ChevronsLeft, ChevronsRight }))
  ],
};
