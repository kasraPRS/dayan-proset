import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { UserPermissions } from "../layouts/menu/enums/menu.enum";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
  userPermission: UserPermissions[] = [];

  constructor(private authenticationService: AuthenticationService) {
    this.loadUserPermissions();
  }

  loadUserPermissions() {
    const decodeToken = this.authenticationService.decodeToken();
    this.userPermission = decodeToken.permission;
  }

  hasPersmission(grantedPermissions: UserPermissions[]): boolean {
    if (
      _.some(grantedPermissions, (permission) =>
        this.userPermission.includes(permission),
      )
    ) {
      return true;
    }

    return false;
  }
}
