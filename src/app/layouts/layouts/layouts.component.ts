import { Component } from "@angular/core";
import { AuthenticationService } from "../../authenticatation/authentication.service";

@Component({
  selector: "app-layouts",
  templateUrl: "./layouts.component.html",
  styleUrls: ["./layouts.component.less"],
})
export class LayoutsComponent {
  constructor(private authenticationService: AuthenticationService) {}

  get isLogin() {
    return this.authenticationService.isLoggedIn();
  }
}
