import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { ProsetPermissionDirective } from "src/app/share/security/proset-permission.directive";
import { ShareModule } from "../../share/share.module";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterOutlet,
    HomeRoutingModule,
    ShareModule,
    NgbNavModule,
    TranslateModule,
    ProsetPermissionDirective,
  ],
})
export class HomeModule {}
