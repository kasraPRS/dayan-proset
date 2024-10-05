import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { finalize } from "rxjs";
import { AuthenticationService } from "../authenticatation/authentication.service";

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const TOKEN = "token";
  const token = localStorage.getItem(TOKEN);
  const authenticationService = inject(AuthenticationService);
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: token },
    });
  }
  return next(req).pipe(
    finalize(() => {
      const header = req.headers as any;
      if (header && authenticationService.isLoggedIn()) {
        let map = new Map<string, []>();
        map = header.headers;
        const token = map.get("authorization") as string[];
        if (token) {
          localStorage.setItem(TOKEN, token[0]);
        }
      }
    }),
  );
};
