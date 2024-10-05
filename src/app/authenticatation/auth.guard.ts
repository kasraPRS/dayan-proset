import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationService } from "./authentication.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  authenticationService.isUserAuthenticated.subscribe((value) => {
    if (authenticationService.isUserAuthenticated.subscribe()) {
      router
        .navigateByUrl(authenticationService.LOGIN_SUCCESS_REDIRECT_URL)
        .then(() => console.log("redirect to home page"));
    } else {
      router
        .navigateByUrl(authenticationService.UNAUTHENTICATED_REDIRECT_URL)
        .then(() => console.log("redirect to login page"));
    }
  });

  return true;
};
