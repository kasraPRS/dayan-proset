import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrganizationFormComponent } from "./organization/organization.component";
import { StartCodeFormComponent } from "./start-code/start-code.component";

const routes: Routes = [
  {
    path: "setting",
    data: {
      breadcrumb: {
        label: "MENU.SETTINGS.TITLE",
        link: "home",
      },
    },
    children: [
      {
        path: "organization",
        component: OrganizationFormComponent,
        data: {
          breadcrumb: {
            label: "MENU.SETTINGS.COMPANY",
          },
        },
      },
      {
        path: "start-code",
        component: StartCodeFormComponent,
        data: {
          breadcrumb: {
            label: "MENU.SETTINGS.START_NUMBER",
          },
        },
      },
      {
        path: "user-management",
        data: {
          breadcrumb: {
            label: "MENU.SETTINGS.USER_MANAGEMENT",
          },
        },
        loadChildren: () =>
          import("../user-management/userManagement.module").then(
            (m) => m.UserManagementModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
