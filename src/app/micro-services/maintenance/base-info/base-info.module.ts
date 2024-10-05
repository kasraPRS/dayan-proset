import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FailureMethodDetectionComponent } from "./failure-method-detection/failure-method-detection.component";
import { BaseInfoRoutingModule } from "./base-info-routing.module";
import { BreadcrumbComponent } from "../../../layouts/breadcrumb/breadcrumb.component";
import { DatatableComponent } from "../../../share/datatable/datatable.component";
import { FailureMethodDetectionFormComponent } from "./failure-method-detection/failure-method-detection-form/failure-method-detection-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MeasurementComponent } from "./measurement/measurement.component";
import { MeasurementFormComponent } from "./measurement/measurement-form/measurement-form.component";
import { LevelComponent } from "./level/level.component";
import { LevelFormComponent } from "./level/level-form/level-form.component";
import { GroupComponent } from "./group/group.component";
import { GroupFormComponent } from "./group/group-form/group-form.component";
import {
  MatCard,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup,
} from "@angular/material/card";
import { NgSelectModule } from "@ng-select/ng-select";
import { ProsetPermissionDirective } from "../../../share/security/proset-permission.directive";
import { EmplacementLocationDefinitionComponent } from "./emplacement-location/emplacement-location-definition.component";
import {
  MatNestedTreeNode,
  MatTree,
  MatTreeNodeDef,
  MatTreeNodeOutlet,
  MatTreeNodeToggle,
} from "@angular/material/tree";
import { MatIconButton } from "@angular/material/button";
import { EmplacementLocationCreationFormComponent } from "./emplacement-location/creation-form/emplacement-location-creation-form.component";
import { CostCenterComponent } from "./cost-center/cost-center.component";
import { CostCenterFormComponent } from "./cost-center/cost-center-form/cost-center-form.component";
import { PartComponent } from "./part/part.component";
import { PartPriceFormComponent } from "./part/part-price-form/part-price-form.component";
import { ShareModule } from "../../../share/share.module";
import { PartFormComponent } from "./part/part-form/part-form.component";
import { MatTooltip } from "@angular/material/tooltip";

@NgModule({
  declarations: [
    FailureMethodDetectionComponent,
    FailureMethodDetectionFormComponent,
    MeasurementComponent,
    MeasurementFormComponent,
    LevelComponent,
    LevelFormComponent,
    GroupComponent,
    GroupFormComponent,
    EmplacementLocationDefinitionComponent,
    EmplacementLocationCreationFormComponent,
    CostCenterComponent,
    CostCenterFormComponent,
    PartComponent,
    PartFormComponent,
    PartPriceFormComponent,
  ],
  imports: [
    CommonModule,
    BaseInfoRoutingModule,
    BreadcrumbComponent,
    DatatableComponent,
    ReactiveFormsModule,
    TranslateModule,
    MatCard,
    MatCardHeader,
    MatCardTitleGroup,
    MatCardSubtitle,
    MatCardTitle,
    NgSelectModule,
    ProsetPermissionDirective,
    MatTree,
    MatNestedTreeNode,
    MatTreeNodeDef,
    MatIconButton,
    MatTreeNodeToggle,
    MatTreeNodeOutlet,
    MatTooltip,
    ShareModule,
  ],
})
export class BaseInfoModule {}
