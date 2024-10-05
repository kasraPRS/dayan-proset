import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButton, MatFabButton } from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup,
} from "@angular/material/card";
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatDivider } from "@angular/material/divider";
import { MatInput } from "@angular/material/input";
import { MatList, MatListItem } from "@angular/material/list";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { ProsetPermissionDirective } from "src/app/share/security/proset-permission.directive";
import { DatatableComponent } from "../../share/datatable/datatable.component";
import { EventComponent } from "../../share/event/event.component";
import { PersonSelectComponent } from "../../share/select-component/person/person-select.component";
import { ShareModule } from "../../share/share.module";
import { ProsetMaintenanceRoutingModule } from "./proset-maintenance-routing.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CKEditorModule,
    NgbNavModule,
    NgSelectModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    ProsetMaintenanceRoutingModule,
    AccordionModule,
    TranslateModule.forChild(),
    PersonSelectComponent,
    EventComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardTitleGroup,
    DatatableComponent,
    MatInput,
    MatTabsModule,
    MatDivider,
    MatButton,
    MatFabButton,
    MatDialogActions,
    MatList,
    MatListItem,
    MatDialogContent,
    MatDialogTitle,
    ProsetPermissionDirective,
  ],
  exports: [],
})
export class ProsetMaintenanceModule {}
