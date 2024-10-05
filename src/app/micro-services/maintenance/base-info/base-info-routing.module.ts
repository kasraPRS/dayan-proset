import { NgModule } from "@angular/core";
import {
  provideRouter,
  RouterModule,
  Routes,
  withComponentInputBinding,
} from "@angular/router";
import { FailureMethodDetectionComponent } from "./failure-method-detection/failure-method-detection.component";
import { MeasurementComponent } from "./measurement/measurement.component";
import { LevelComponent } from "./level/level.component";
import { GroupComponent } from "./group/group.component";
import { EmplacementLocationDefinitionComponent } from "./emplacement-location/emplacement-location-definition.component";
import { CostCenterComponent } from "./cost-center/cost-center.component";
import { PartFormComponent } from "./part/part-form/part-form.component";
import { PartComponent } from "./part/part.component";

const routes: Routes = [
  {
    path: "measurement/list",
    data: {
      breadcrumb: {
        label: "MENU.BASE_INFO.MEASUREMENT",
      },
    },
    component: MeasurementComponent,
  },
  {
    path: "level/list",
    data: {
      breadcrumb: {
        label: "MENU.BASE_INFO.LEVEL",
      },
    },
    component: LevelComponent,
  },
  {
    path: "group/list",
    data: {
      breadcrumb: {
        label: "MENU.BASE_INFO.GROUP",
      },
    },
    component: GroupComponent,
  },
  {
    path: "emplacement-location/list",
    data: {
      breadcrumb: {
        label: "MENU.BASE_INFO.EMPLACEMENT_LOCATION",
      },
    },
    component: EmplacementLocationDefinitionComponent,
  },
  {
    path: "cost-center/list",
    data: {
      breadcrumb: {
        label: "MENU.BASE_INFO.COST_CENTER",
      },
    },
    component: CostCenterComponent,
  },
  {
    path: "part/list",
    data: {
      breadcrumb: {
        label: "MENU.BASE_INFO.PART",
      },
    },
    component: PartComponent,
  },
  {
    path: "part/form",
    data: {
      breadcrumb: {
        label: "MENU.BASE_INFO.PART",
      },
    },
    component: PartFormComponent,
  },
  {
    path: "part/form/:viewType/:id",
    data: {
      breadcrumb: {
        label: "MENU.BASE_INFO.PART",
      },
    },
    component: PartFormComponent,
  },
  {
    path: "failure-method-detection/list",
    data: {
      breadcrumb: {
        label: "MENU.BASE_INFO.FAILURE_DETECTION_METHOD",
      },
    },
    component: FailureMethodDetectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [provideRouter(routes, withComponentInputBinding())],
})
export class BaseInfoRoutingModule {}
