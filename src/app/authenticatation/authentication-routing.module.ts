import { NgModule } from "@angular/core";
import {
  provideRouter,
  RouterModule,
  Routes,
  withComponentInputBinding,
} from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { authGuard } from "./auth.guard";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
    children: [
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path: "rest-password",
        component: ResetPasswordComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [provideRouter(routes, withComponentInputBinding())],
})
export class AuthenticationRoutingModule {}
