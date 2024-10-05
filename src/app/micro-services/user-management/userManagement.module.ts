import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconButton } from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup,
  MatCardXlImage,
} from "@angular/material/card";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatDialogTitle } from "@angular/material/dialog";
import { MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import {
  MatTab,
  MatTabGroup,
  MatTabNavPanel,
  MatTabsModule,
} from "@angular/material/tabs";
import { MatTooltip } from "@angular/material/tooltip";
import {
  MatNestedTreeNode,
  MatTree,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from "@angular/material/tree";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { ProsetPermissionDirective } from "src/app/share/security/proset-permission.directive";
import { DatatableComponent } from "../../share/datatable/datatable.component";
import { ShareModule } from "../../share/share.module";
import { NationalCodeValidatorDirective } from "../../share/validation/directives/national-code-validator.directive";
import { PersonListComponent } from "./person-list/person-list.component";
import { PermissionComponent } from "./person/permission/permission.component";
import { PersonComponent } from "./person/person.component";
import { WageComponent } from "./person/wage/wage.component";
import { WorkOrderListComponent } from "./person/work-order-list/work-order-list.component";
import { UserManagementComponent } from "./user-management/user-management.component";
import { BreadcrumbComponent } from "../../layouts/breadcrumb/breadcrumb.component";
import { TeamListComponent } from "./team-list/team-list.component";
import { TeamFormComponent } from "./team-form/team-form.component";
import { UserManagementRoutingModule } from "./user-management-routing.module";

@NgModule({
  declarations: [
    PersonComponent,
    PermissionComponent,
    WageComponent,
    WorkOrderListComponent,
    UserManagementComponent,
    PersonListComponent,
    TeamListComponent,
    TeamFormComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    ReactiveFormsModule,
    NationalCodeValidatorDirective,
    UserManagementRoutingModule,
    MatDialogTitle,
    MatTab,
    MatTabGroup,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatCheckbox,
    MatTreeNodeToggle,
    MatTreeNodePadding,
    MatIcon,
    MatIconButton,
    MatNestedTreeNode,
    MatFormField,
    MatCardTitle,
    MatCardSubtitle,
    MatCardTitleGroup,
    MatCardContent,
    MatCardHeader,
    MatCard,
    MatCardXlImage,
    ShareModule,
    DatatableComponent,
    MatTooltip,
    MatTabNavPanel,
    MatTabsModule,
    ProsetPermissionDirective,
    BreadcrumbComponent,
  ],
})
export class UserManagementModule {}
