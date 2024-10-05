import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home.component";

const routs: Routes = [
  // {
  //   path: "",
  //   component: DashbordComponent,
  //   data: { breadcrumbs: true, text: "home" },
  // },
  {
    path: "home",
    component: HomeComponent,
    data: { breadcrumbs: true, text: "home" },
    // children: [
    //   {
    //     path: "cartable",
    //     component: CartableComponent,
    //     data: { breadcrumbs: true, text: "cartable" },
    //   },
    // ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routs)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
