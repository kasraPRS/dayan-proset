import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TeamListComponent } from "./team-list/team-list.component";
import { PersonListComponent } from "./person-list/person-list.component";
import { PersonComponent } from "./person/person.component";
import { UserManagementComponent } from "./user-management/user-management.component";

const routes: Routes = [
  {
    path: "",
    component: UserManagementComponent,
    children: [
      {
        path: "person",
        component: PersonListComponent,
        data: {
          breadcrumb: {
            label: "MENU.SETTINGS.PERSONS",
            link: "home",
          },
        },
      },
      {
        path: "team",
        component: TeamListComponent,
        data: {
          breadcrumb: {
            label: "MENU.SETTINGS.TEAM",
            link: "home",
          },
        },
      },
    ],
  },
  {
    path: "person/:viewType",
    component: PersonComponent,
    data: {
      breadcrumb: {
        label: "MENU.SETTINGS.PERSONS",
        link: "home",
      },
    },
  },
  {
    path: "person/:viewType/:id",
    component: PersonComponent,
    data: {
      breadcrumb: {
        label: "MENU.SETTINGS.PERSONS",
        link: "home",
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
