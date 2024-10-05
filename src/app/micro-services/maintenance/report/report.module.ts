import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { HighchartsChartModule } from "highcharts-angular";
import { routes } from "src/app/app-routing.module";
import { DatatableComponent } from "src/app/share/datatable/datatable.component";
import { ProsetChartComponent } from "src/app/share/proset-chart/proset-chart.component";
import { ProsetPermissionDirective } from "src/app/share/security/proset-permission.directive";
import { ShareModule } from "src/app/share/share.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportListViewComponent } from "./report-list-view/report-list-view.component";
import { ReportRoutingModule } from "./report-routing.module";
import { StatusCountCardComponent } from "./status-count-card/status-count-card.component";
import { AssetReportTabComponent } from "./tabs/asset-report-tab/asset-report-tab.component";
import { PartReportTabComponent } from "./tabs/part-report-tab/part-report-tab.component";
import { WorkOrderReportTabComponent } from "./tabs/work-order-report-tab/work-order-report-tab.component";
import { WorkRequestReportTabComponent } from "./tabs/work-request-report-tab/work-request-report-tab.component";
import { BreadcrumbComponent } from "../../../layouts/breadcrumb/breadcrumb.component";

@NgModule({
  declarations: [
    StatusCountCardComponent,
    DashboardComponent,
    ReportListViewComponent,
    WorkOrderReportTabComponent,
    WorkRequestReportTabComponent,
    AssetReportTabComponent,
    PartReportTabComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatProgressBarModule,
    HighchartsChartModule,
    ReportRoutingModule,
    TranslateModule,
    MatIconModule,
    ShareModule,
    MatProgressSpinnerModule,
    ProsetChartComponent,
    DatatableComponent,
    ProsetPermissionDirective,
    BreadcrumbComponent,
  ],
  providers: [provideRouter(routes, withComponentInputBinding())],
})
export class ReportModule {}
