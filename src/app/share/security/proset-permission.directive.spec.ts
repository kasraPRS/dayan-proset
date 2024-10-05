import { TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthenticationService } from "src/app/authenticatation/authentication.service";
import { ProsetPermissionDirective } from "./proset-permission.directive";

describe("ProsetPermissionDirective", () => {
  let viewContainer: ViewContainerRef;
  let templateRef: TemplateRef<any>;
  let authenticationService: AuthenticationService;

  it("should create an instance", () => {
    const directive = new ProsetPermissionDirective(
      templateRef,
      viewContainer,
      authenticationService,
    );
    expect(directive).toBeTruthy();
  });
});
