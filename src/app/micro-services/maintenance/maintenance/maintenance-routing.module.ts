import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WorkRequestListComponent } from "./work-request/work-request-list/work-request-list.component";
import { WorkRequestFormComponent } from "./work-request/work-request-form/work-request-form.component";
import { WorkOrderListComponent } from "./work-order/work-order-list/work-order-list.component";
import { WorkOrderFormComponent } from "./work-order/work-order-form/work-order-form.component";
import { RepairPlanningListComponent } from "./repair-planning/repair-planning-list/repair-planning-list.component";
import { RepairPlanningComponent } from "./repair-planning/repair-planning/repair-planning.component";
import { TabType } from "./repair-planning/repair-planning/enum/repair-planning.enum";
import { ChecklistComponent } from "./checklist/checklist.component";
import { ChecklistFormComponent } from "./checklist/checklist-form/checklist-form.component";

const routes: Routes = [
  {
    path: "work-request/list",
    component: WorkRequestListComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.WORK-REQUEST",
        link: "home",
      },
    },
  },
  {
    path: "work-request/:viewType/:requestId",
    component: WorkRequestFormComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.WORK-REQUEST",
        link: "home",
      },
    },
  },
  {
    path: "work-request/:viewType",
    component: WorkRequestFormComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.WORK-REQUEST",
        link: "home",
      },
    },
  },
  {
    path: "work-order/list",
    component: WorkOrderListComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.WORK_ORDERS",
      },
    },
  },
  {
    path: "work-order/:viewType/:id",
    component: WorkOrderFormComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.WORK_ORDERS",
      },
    },
  },

  {
    path: "work-order/:viewType",
    component: WorkOrderFormComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.WORK_ORDERS",
      },
    },
  },
  {
    path: "work-order/:fromType/:viewType/:code",
    component: WorkOrderFormComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.WORK_ORDERS",
      },
    },
  },
  {
    path: "work-order/:fromType/:viewType/id/:id",
    component: WorkOrderFormComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.WORK_ORDERS",
      },
    },
  },
  {
    path: "repair-planning/list",
    component: RepairPlanningListComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.REPAIR_PLANNING",
      },
    },
  },
  {
    path: "repair-planning/:viewType/:id",
    component: RepairPlanningComponent,
    data: {
      activeTab: TabType.REPAIR_PLANNING_CREATE,
      breadcrumb: {
        label: "MENU.MAINTENANCE.REPAIR_PLANNING",
      },
    },
  },
  {
    path: "repair-planning/:viewType",
    component: RepairPlanningComponent,
    data: {
      activeTab: TabType.REPAIR_PLANNING_CREATE,
      breadcrumb: {
        label: "MENU.MAINTENANCE.REPAIR_PLANNING",
      },
    },
  },
  {
    path: "checklist/list",
    component: ChecklistComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.CHECKLIST",
      },
    },
  },
  {
    path: "checklist/form",
    component: ChecklistFormComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.CHECKLIST",
      },
    },
  },
  {
    path: "checklist/form/:viewType/:id",
    component: ChecklistFormComponent,
    data: {
      breadcrumb: {
        label: "MENU.MAINTENANCE.CHECKLIST",
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceRoutingModule {}
