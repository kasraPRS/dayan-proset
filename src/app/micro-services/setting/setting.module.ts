import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { routes } from "src/app/app-routing.module";
import { EventComponent } from "src/app/share/event/event.component";
import { ProsetPermissionDirective } from "src/app/share/security/proset-permission.directive";
import { ShareModule } from "src/app/share/share.module";
import { OrganizationFormComponent } from "./organization/organization.component";
import { SettingRoutingModule } from "./setting-routing.module";
import { StartCodeFormComponent } from "./start-code/start-code.component";
import { BreadcrumbComponent } from "../../layouts/breadcrumb/breadcrumb.component";

@NgModule({
  declarations: [OrganizationFormComponent, StartCodeFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShareModule,
    TranslateModule,
    SettingRoutingModule,
    EventComponent,
    ProsetPermissionDirective,
    BreadcrumbComponent,
  ],
  providers: [provideRouter(routes, withComponentInputBinding())],
})
export class SettingModule {}
