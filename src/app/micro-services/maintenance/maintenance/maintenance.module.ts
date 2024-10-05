import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaintenanceRoutingModule } from "./maintenance-routing.module";
import { WorkRequestFormComponent } from "./work-request/work-request-form/work-request-form.component";
import { WorkRequestListComponent } from "./work-request/work-request-list/work-request-list.component";
import { ShareModule } from "../../../share/share.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { NgSelectModule } from "@ng-select/ng-select";
import { DatatableComponent } from "../../../share/datatable/datatable.component";
import { ProsetPermissionDirective } from "../../../share/security/proset-permission.directive";
import { EventComponent } from "../../../share/event/event.component";
import { AccordionModule } from "ngx-bootstrap/accordion";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup,
} from "@angular/material/card";
import { BreadcrumbComponent } from "../../../layouts/breadcrumb/breadcrumb.component";
import { WorkOrderListComponent } from "./work-order/work-order-list/work-order-list.component";
import { WorkOrderFormComponent } from "./work-order/work-order-form/work-order-form.component";
import { WorkOrderComponent } from "./work-order/work-order-form/work-order/work-order.component";
import { WorkLogComponent } from "./work-order/work-order-form/work-log/work-log.component";
import { WorkLogActivityComponent } from "./work-order/work-order-form/work-log/work-log-activity/work-log-activity.component";
import { WorkLogPersonnelComponent } from "./work-order/work-order-form/work-log/work-log-personnel/work-log-personnel.component";
import { WorkLogPartComponent } from "./work-order/work-order-form/work-log/work-log-part/work-log-part.component";
import { WorkLogContractorComponent } from "./work-order/work-order-form/work-log/work-log-contractor/work-log-contractor.component";
import { WorkLogPersonnelDialogComponent } from "./work-order/work-order-form/work-log/dialogs/work-log-personnel-dialog/work-log-personnel-dialog.component";
import { WorkLogPartDialogComponent } from "./work-order/work-order-form/work-log/dialogs/work-log-part-dialog/work-log-part-dialog.component";
import { WorkLogContractorDialogComponent } from "./work-order/work-order-form/work-log/dialogs/work-log-contractor-dialog/work-log-contractor-dialog.component";
import { WorkLogChecklistComponent } from "./work-order/work-order-form/work-log/work-log-checklist/work-log-checklist.component";
import { ActivityModalComponent } from "./work-order/work-order-form/work-log/dialogs/activity-modal/activity-modal.component";
import { WorkOrderDatepickerComponent } from "./work-order/work-order-form/work-order/work-order-datepicker/work-order-datepicker.component";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { EventCalendarComponent } from "../../../share/event-calendar/event-calendar.component";
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from "@angular/material/button-toggle";
import { RepairPlanningListComponent } from "./repair-planning/repair-planning-list/repair-planning-list.component";
import { RepairPlanningFormComponent } from "./repair-planning/repair-planning/repair-planning-form/repair-planning-form.component";
import { RepairPlanningComponent } from "./repair-planning/repair-planning/repair-planning.component";
import { RepairPlanningWorkLogsComponent } from "./repair-planning/repair-planning/repair-planning-work-logs/repair-planning-work-logs.component";
import { RepairPlanningWorkLogDetailsComponent } from "./repair-planning/repair-planning/repair-planning-work-logs/repair-planning-work-log-details/repair-planning-work-log-details.component";
import { RepairPlanningChecklistComponent } from "./repair-planning/repair-planning/repair-planning-checklist/repair-planning-checklist.component";
import { ChecklistComponent } from "./checklist/checklist.component";
import { ChecklistFormComponent } from "./checklist/checklist-form/checklist-form.component";
import { ChecklistTaskComponent } from "./checklist/checklist-form/checklist-task/checklist-task.component";
import { MatDivider } from "@angular/material/divider";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ExpandableDatatableComponent } from "../../../share/expandable-datatable/expandable-datatable.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from "@angular/material/dialog";
import { ProsetJalaliDatetimePipe } from "../../../share/jalalidate/proset.jalali.datetime.pipe";
import { AssetTreeSelectComponent } from "src/app/share/tree/asset-tree/asset-tree-select.component";

@NgModule({
  declarations: [
    WorkRequestFormComponent,
    WorkRequestListComponent,
    WorkOrderListComponent,
    WorkOrderFormComponent,
    WorkOrderComponent,
    WorkLogComponent,
    WorkLogActivityComponent,
    WorkLogPersonnelComponent,
    WorkLogPartComponent,
    WorkLogContractorComponent,
    WorkLogPersonnelDialogComponent,
    WorkLogPartDialogComponent,
    WorkLogContractorDialogComponent,
    WorkLogChecklistComponent,
    ActivityModalComponent,
    WorkOrderDatepickerComponent,
    RepairPlanningListComponent,
    RepairPlanningFormComponent,
    RepairPlanningComponent,
    RepairPlanningWorkLogsComponent,
    RepairPlanningWorkLogDetailsComponent,
    RepairPlanningChecklistComponent,
    ChecklistComponent,
    ChecklistFormComponent,
    ChecklistTaskComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    DatatableComponent,
    ProsetPermissionDirective,
    EventComponent,
    AccordionModule,
    AccordionModule,
    MatCard,
    MatCardHeader,
    MatCardTitleGroup,
    MatCardSubtitle,
    MatCardTitle,
    BreadcrumbComponent,
    MatTabGroup,
    MatTab,
    EventCalendarComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatCardContent,
    MatDivider,
    CKEditorModule,
    FormsModule,
    ExpandableDatatableComponent,
    NgxDatatableModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogClose,
    ProsetJalaliDatetimePipe,
    MatDialogActions,
    AssetTreeSelectComponent,
  ],
})
export class MaintenanceModule {}
