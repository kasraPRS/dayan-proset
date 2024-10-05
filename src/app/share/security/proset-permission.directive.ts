import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { PermissionsService } from "src/app/authenticatation/permissions.service";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";

@Directive({
  selector: "[prosetHasPermissions]",
  standalone: true,
})
export class ProsetPermissionDirective implements OnInit {
  @Input("prosetHasPermissions") grantedPermissions: UserPermissions[];
  userPermission: UserPermissions[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionsService: PermissionsService,
  ) {}

  ngOnInit(): void {
    this.permissionsService.loadUserPermissions();
    this.updateView();
  }

  private updateView(): void {
    this.viewContainer.clear();
    if (this.permissionsService.hasPersmission(this.grantedPermissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
