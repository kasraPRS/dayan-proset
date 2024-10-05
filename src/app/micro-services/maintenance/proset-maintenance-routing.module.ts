import { NgModule } from "@angular/core";
import {
  provideRouter,
  RouterModule,
  Routes,
  withComponentInputBinding,
} from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { ErrorLogComponent } from "./events/error-log/error-log.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    pathMatch: "full",
  },
  {
    path: "maintenance",
    children: [
      {
        path: "base-info",
        data: {
          breadcrumb: {
            label: "MENU.BASE_INFO.TITLE",
            link: "home",
          },
        },
        loadChildren: () =>
          import("../maintenance/base-info/base-info.module").then(
            (m) => m.BaseInfoModule,
          ),
      },
      {
        path: "asset",
        data: {
          breadcrumb: {
            label: "MENU.ASSET.TITLE",
            link: "home",
          },
        },
        loadChildren: () =>
          import("../maintenance/asset/asset.module").then(
            (m) => m.AssetModule,
          ),
      },
      {
        path: "maintenance",
        data: {
          breadcrumb: {
            label: "MENU.MAINTENANCE.TITLE",
            link: "home",
          },
        },
        loadChildren: () =>
          import("../maintenance/maintenance/maintenance.module").then(
            (m) => m.MaintenanceModule,
          ),
      },
      {
        path: "events/error-log/list",
        component: ErrorLogComponent,
      },
      {
        path: "reports",
        loadChildren: () =>
          import("../maintenance/report/report.module").then(
            (m) => m.ReportModule,
          ),
        data: {
          breadcrumb: {
            label: "MENU.REPORTS.TITLE",
            link: "home",
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [provideRouter(routes, withComponentInputBinding())],
})
export class ProsetMaintenanceRoutingModule {}
