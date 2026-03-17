import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@core/services/auth/auth.service';
import { NivelUsuario } from '@core/interfaces/auth.interface';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { redirectTo: state.url },
  });
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.canManageUsers()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};

export const routeAccessGuard = (routePath: string): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.canAccessRoute(routePath)) {
    return true;
  }

  return router.createUrlTree(['/home']);
};

export const roleGuard = (...roles: NivelUsuario[]): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasRole(...roles)) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
