import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AssetFormComponent } from "./assets/asset-form/asset-form.component";
import { AssetListComponent } from "./assets/asset-list/asset-list.component";
import { ActivityComponent } from "./activity/activity.component";
import { FailureModeComponent } from "./failure-mode/failure-mode.component";
import { FailureReasonComponent } from "./failure-reason/failure-reason.component";
import { FailureMechanismComponent } from "./failure-mechanism/failure-mechanism.component";
const routes: Routes = [
  {
    path: "asset/list",
    component: AssetListComponent,
    data: {
      breadcrumb: {
        label: "MENU.ASSET.ASSET",
      },
    },
  },
  {
    path: "asset/:viewType/:assetId",
    component: AssetFormComponent,
    data: {
      breadcrumb: {
        label: "MENU.ASSET.ASSET",
      },
    },
  },
  {
    path: "asset/:viewType",
    component: AssetFormComponent,
    data: {
      breadcrumb: {
        label: "MENU.ASSET.ASSET",
      },
    },
  },
  {
    path: "activity/list",
    component: ActivityComponent,
    data: {
      breadcrumb: {
        label: "MENU.ASSET.ACTIVITY",
      },
    },
  },
  {
    path: "failure-mode/list",
    component: FailureModeComponent,
    data: {
      breadcrumb: {
        label: "MENU.ASSET.FAILURE_MODE",
      },
    },
  },
  {
    path: "failure-reason/list",
    component: FailureReasonComponent,
    data: {
      breadcrumb: {
        label: "MENU.ASSET.FAILURE_REASON",
      },
    },
  },
  {
    path: "failure-mechanism/list",
    component: FailureMechanismComponent,
    data: {
      breadcrumb: {
        label: "MENU.ASSET.FAILURE_MECHANISM",
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetRoutingModule {}
