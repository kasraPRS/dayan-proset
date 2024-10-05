import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup,
} from "@angular/material/card";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { MatTreeModule } from "@angular/material/tree";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { routes } from "src/app/app-routing.module";
import { DatatableComponent } from "src/app/share/datatable/datatable.component";
import { EventComponent } from "src/app/share/event/event.component";
import { ProsetChartComponent } from "src/app/share/proset-chart/proset-chart.component";
import { ProsetPermissionDirective } from "src/app/share/security/proset-permission.directive";
import { PersonSelectComponent } from "src/app/share/select-component/person/person-select.component";
import { ShareModule } from "src/app/share/share.module";
import { AssetFormComponent } from "./assets/asset-form/asset-form.component";
import { AssetActivityListComponent } from "./assets/asset-form/components/activity/activity.component";
import { AssetCostListComponent } from "./assets/asset-form/components/cost/cost.component";
import { AssetDocumentListComponent } from "./assets/asset-form/components/document/document.component";
import { AssetFailureModeListComponent } from "./assets/asset-form/components/failure-mode/failure-mode.component";
import { AssetFinancialComponent } from "./assets/asset-form/components/financial/financial.component";
import { AssetInsuranceAndGuaranteeComponent } from "./assets/asset-form/components/insurance-and-guarantee/insurance-and-guarantee.component";
import { AssetMainInfoComponent } from "./assets/asset-form/components/main-Info/main-info.component";
import { AssetPartListComponent } from "./assets/asset-form/components/part/part.component";
import { AssetTechnicalComponent } from "./assets/asset-form/components/technical/technical.component";
import { AssetWorkOrderListComponent } from "./assets/asset-form/components/work-order-list/work-order-list.component";
import { AssetRequestListComponent } from "./assets/asset-form/components/work-request-list/request-list.component";
import { AssetListComponent } from "./assets/asset-list/asset-list.component";
import { AssetRoutingModule } from "./asset-routing.module";
import { MatList, MatListItem } from "@angular/material/list";
import { TreeColumnComponent } from "./assets/shared/tree-column/tree-column.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { BreadcrumbComponent } from "../../../layouts/breadcrumb/breadcrumb.component";
import { ActivityComponent } from "./activity/activity.component";
import { ActivityFormComponent } from "./activity/activity-form/activity-form.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { FailureModeComponent } from "./failure-mode/failure-mode.component";
import { FailureModeFormComponent } from "./failure-mode/failure-mode-form/failure-mode-form.component";
import { AssetTreeSelectComponent } from "src/app/share/tree/asset-tree/asset-tree-select.component";
import { EmplacementLocationTreeSelectComponent } from "src/app/share/tree/emplacement-locations-tree/emplacement-locations-tree-select.component";
import { FailureReasonComponent } from "./failure-reason/failure-reason.component";
import { FailureReasonFormComponent } from "./failure-reason/failure-reason-form/failure-reason-form.component";
import { FailureMechanismComponent } from "./failure-mechanism/failure-mechanism.component";
import { FailureMechanismFormComponent } from "./failure-mechanism/failure-mechanism-form/failure-mechanism-form.component";

@NgModule({
  declarations: [
    AssetListComponent,
    AssetFormComponent,
    AssetMainInfoComponent,
    AssetFinancialComponent,
    AssetTechnicalComponent,
    AssetInsuranceAndGuaranteeComponent,
    AssetActivityListComponent,
    AssetFailureModeListComponent,
    AssetPartListComponent,
    AssetWorkOrderListComponent,
    AssetRequestListComponent,
    AssetCostListComponent,
    AssetDocumentListComponent,
    TreeColumnComponent,
    ActivityComponent,
    ActivityFormComponent,
    FailureModeComponent,
    FailureModeFormComponent,
    FailureReasonComponent,
    FailureReasonFormComponent,
    FailureMechanismComponent,
    FailureMechanismFormComponent,
  ],
  imports: [
    CommonModule,
    AssetRoutingModule,
    ReactiveFormsModule,
    ShareModule,
    FormsModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardTitleGroup,
    NgSelectModule,
    NgbNavModule,
    TranslateModule,
    EventComponent,
    MatTabGroup,
    MatTab,
    MatTreeModule,
    MatList,
    MatListItem,
    DatatableComponent,
    PersonSelectComponent,
    ProsetChartComponent,
    ProsetPermissionDirective,
    MatDialogModule,
    MatButtonModule,
    MatDivider,
    MatMenuModule,
    BreadcrumbComponent,
    CKEditorModule,
    AccordionModule,
    AccordionModule,
    AssetTreeSelectComponent,
    EmplacementLocationTreeSelectComponent,
  ],
  providers: [provideRouter(routes, withComponentInputBinding())],
})
export class AssetModule {}
