import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticateApi, TokenRequest } from "@proset/maintenance-client";
import jwtDecode from "jwt-decode";
import { BehaviorSubject, finalize } from "rxjs";
import { LoaderService } from "../share/service/loader.service";
import { TokenPayload } from "./model/token-payload";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  readonly TOKEN = "token";
  readonly UNAUTHENTICATED_REDIRECT_URL = "login";
  readonly LOGIN_SUCCESS_REDIRECT_URL = "home";
  readonly RESET_PASSWORD_URL = "rest-password";

  isUserAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(
    private authenticateApi: AuthenticateApi,
    private router: Router,
    private loaderService: LoaderService,
  ) {}

  login(tokenRequest: TokenRequest) {
    this.loaderService.setLoading(true);
    this.authenticateApi
      .login(tokenRequest)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((res) => {
        localStorage.setItem(this.TOKEN, res.token!);
        this.router.navigateByUrl(this.LOGIN_SUCCESS_REDIRECT_URL).then(() => {
          this.isUserAuthenticated.next(true);
        });
      });
  }

  logout() {
    this.authenticateApi.logout().subscribe(() => {});
    this.removeTokenAndRedirect();
  }

  removeTokenAndRedirect() {
    localStorage.removeItem(this.TOKEN);
    this.router
      .navigateByUrl(this.UNAUTHENTICATED_REDIRECT_URL)
      .then(() => () => {
        console.log("Logout Successful ...........");
        this.router.navigate(["/login"]);
        this.isUserAuthenticated.next(false);
      });
  }
  isLoggedIn(): boolean {
    let token = localStorage.getItem(this.TOKEN);
    return token != null && token.length > 0;
  }

  decodeToken(): TokenPayload {
    let token = localStorage.getItem(this.TOKEN);
    if (token) {
      return jwtDecode<TokenPayload>(token);
    }
    return { permission: [] } as any;
  }
}
