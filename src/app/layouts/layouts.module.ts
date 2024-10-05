import { NgForOf, NgIf } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatDrawer, MatDrawerContainer } from "@angular/material/sidenav";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { ProsetPermissionDirective } from "../share/security/proset-permission.directive";
import { ShareModule } from "../share/share.module";
import { ContentComponent } from "./content/content.component";
import { HeaderComponent } from "./header/header.component";
import { LayoutsComponent } from "./layouts/layouts.component";
import { MenuComponent } from "./menu/menu.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";

@NgModule({
  declarations: [
    ContentComponent,
    LayoutsComponent,
    HeaderComponent,
    MenuComponent,
  ],
  exports: [LayoutsComponent],
  imports: [
    ShareModule,
    ReactiveFormsModule,
    MatDrawerContainer,
    MatDrawer,
    MatMenuModule,
    MatListModule,
    RouterOutlet,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    NgForOf,
    NgIf,
    ProsetPermissionDirective,
    BreadcrumbComponent,
  ],
})
export class LayoutsModule {}
