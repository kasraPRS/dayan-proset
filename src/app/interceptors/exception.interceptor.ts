import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { finalize, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AuthenticationService } from "../authenticatation/authentication.service";
import { ToastService } from "../share/service/toast.service";

export const SHOW_TOAST = new HttpContextToken<boolean>(() => true);

export const exceptionInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthenticationService);
  const toastService = inject(ToastService);
  return next(req).pipe(
    tap((response) => {
      const showToast = req.context.get(SHOW_TOAST);
      if (response instanceof HttpResponse && showToast) {
        if (!["authenticate/login"].filter((f) => req.url.includes(f)).length)
          switch (response.status) {
            case 200: {
              if (req.method.toLowerCase() == "post")
                toastService.success("MESSAGES.SAVE_SUCCESSFUL");
              if (req.method.toLowerCase() == "put")
                toastService.success("MESSAGES.UPDATE_SUCCESSFUL");
              break;
            }
            case 209: {
              if (req.method.toLowerCase() == "delete")
                toastService.success("MESSAGES.DELETE_SUCCESSFUL");
              break;
            }
          }
      }
    }),
    finalize(() => {}),
    catchError((response: HttpErrorResponse) => {
      const showToast = req.context.get(SHOW_TOAST);
      switch (response.status) {
        case 401: {
          toastService.error(
            response.error?.exceptionMessage || "GENERAL.ERROR",
          );
          break;
        }

        case 403: {
          toastService.error("GENERAL.ERROR");
          authenticationService.removeTokenAndRedirect();
          break;
        }

        case 404: {
          toastService.error(
            response.error?.exceptionMessage || "GENERAL.ERROR",
          );
          break;
        }
        case 406: {
          if (
            showToast &&
            !["MESSAGES.CODE_DUPLICATE_EXCEPTION"].includes(
              response.error?.exceptionMessage,
            )
          )
            toastService.error(
              response.error?.exceptionMessage || "GENERAL.ERROR",
            );
          break;
        }
        case 409: {
          if (showToast) {
            toastService.error(
              response.error?.exceptionMessage || "GENERAL.ERROR",
            );
          }
          break;
        }
        case 500: {
          toastService.error("MESSAGES.SERVER_ERROR");
          break;
        }
      }
      return throwError(() => response);
    }),
  );
};
