import { DragDropModule } from "@angular/cdk/drag-drop";
import {
  CommonModule,
  CurrencyPipe,
  DecimalPipe,
  NgOptimizedImage,
} from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAnchor, MatButton } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FilePickerModule } from "ngx-awesome-uploader";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxPrintDirective } from "ngx-print";
import { ColumnSelectorComponent } from "./datatable/column-selector/column-selector.component";
import { CustomDatatablePagerComponent } from "./datatable/custom-datatable-pager/custom-datatable-pager.component";
import { NgxMatDateFnsModule } from "./datepicker/datepickerAdapter/data-fns.module";
import { ProsetDatepickerComponent } from "./datepicker/proset-datepicker.component";
import { InputPriceDirective } from "./directives/input-format-price/input-format-price.directive";
import { NumbersOnlyDirective } from "./directives/numbers-only.directive";
import { ExceptionModalComponent } from "./exception-modal/exception-modal.component";
import { FilterModalComponent } from "./filter-modal/filter-modal.component";
import { ProsetJalaliDatePipe } from "./jalalidate/proset.jalalidate.pipe";
import { ConfirmDialogComponent } from "./modal-component/confirm-dialog/confirm-dialog.component";
import { ModalComponent } from "./modal-component/modal.component";
import { ProsetNgxDocumentUploadComponent } from "./ngx-document-upload/proset-ngx-document-upload.component";
import { ProsetPermissionDirective } from "./security/proset-permission.directive";
import { AssetSelectComponent } from "./select-component/asset/asset-select.component";
import { CostCenterSelectComponent } from "./select-component/cost-center/cost-center-select.component";
import { EmplacementLocationSelectComponent } from "./select-component/emplacementLocation/emplacement-location-select.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { CharacterAndNumberValidatorDirective } from "./validation/directives/character-and-number-validator.directive";
import { NumberValidatorDirective } from "./validation/directives/number-validator.directive";
import { PhoneNumberValidatorDirective } from "./validation/directives/phone-number-validator.directive";
import { PostalCodeValidatorDirective } from "./validation/directives/postal-code-validator.directive";
import { UsernameValidatorDirective } from "./validation/directives/username-validator.directive";

import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup,
} from "@angular/material/card";
import { MatCheckbox } from "@angular/material/checkbox";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatListOption, MatSelectionList } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DatatableComponent } from "./datatable/datatable.component";
import { ClickOutsideSidebarDirective } from "./directives/click-outside.directive";
import { KanbanBoardComponent } from "./kanban/kanban-board/kanban-board.component";
import { KanbanCardComponent } from "./kanban/kanban-card/kanban-card.component";
import { KanbanConfigComponent } from "./kanban/kanban-config/kanban-config.component";
import { KanbanMoreInfoModalComponent } from "./kanban/more-info-modal/more-info-modal.component";
import { ChecklistModalComponent } from "./modal-component/checklist-modal/checklist-modal.component";
import { SearchFilterPipe } from "./modal-component/checklist-modal/search-filter.pipe";
import { InfoDialogComponent } from "./modal-component/info-dialog/info-dialog.component";
import { MatModalComponent } from "./modal-component/mat-modal/mat-modal.component";
import { PersonSelectComponent } from "./select-component/person/person-select.component";
import { SidebarFilterComponent } from "./sidebar-filter/sidebar-filter.component";
import { UploaderComponent } from "./uploader/uploader.component";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTreeModule } from "@angular/material/tree";
import { FailureDetectionMethodSelectComponent } from "./select-component/failureDetectionMethod/failure-detection-method-select.component";

@NgModule({
  declarations: [
    CustomDatatablePagerComponent,
    ConfirmDialogComponent,
    InfoDialogComponent,
    ModalComponent,
    ExceptionModalComponent,
    ProsetJalaliDatePipe,
    CharacterAndNumberValidatorDirective,
    NumberValidatorDirective,
    PhoneNumberValidatorDirective,
    PostalCodeValidatorDirective,
    UsernameValidatorDirective,
    ProsetNgxDocumentUploadComponent,
    SpinnerComponent,
    ColumnSelectorComponent,
    ProsetDatepickerComponent,
    InputPriceDirective,
    FilterModalComponent,
    NumbersOnlyDirective,
    AssetSelectComponent,
    EmplacementLocationSelectComponent,
    CostCenterSelectComponent,
    KanbanBoardComponent,
    KanbanCardComponent,
    KanbanConfigComponent,
    KanbanMoreInfoModalComponent,
    ClickOutsideSidebarDirective,
    SidebarFilterComponent,
    MatModalComponent,
    UploaderComponent,
    ChecklistModalComponent,
    SearchFilterPipe,
    FailureDetectionMethodSelectComponent,
  ],
  exports: [
    ModalComponent,
    ExceptionModalComponent,
    ProsetJalaliDatePipe,
    CharacterAndNumberValidatorDirective,
    NumberValidatorDirective,
    PhoneNumberValidatorDirective,
    PostalCodeValidatorDirective,
    UsernameValidatorDirective,
    ProsetNgxDocumentUploadComponent,
    SpinnerComponent,
    ProsetDatepickerComponent,
    NumbersOnlyDirective,
    InputPriceDirective,
    FilterModalComponent,
    TooltipModule,
    AssetSelectComponent,
    EmplacementLocationSelectComponent,
    CostCenterSelectComponent,
    KanbanBoardComponent,
    KanbanCardComponent,
    KanbanConfigComponent,
    KanbanMoreInfoModalComponent,
    ClickOutsideSidebarDirective,
    SidebarFilterComponent,
    MatModalComponent,
    UploaderComponent,
    PersonSelectComponent,
    FailureDetectionMethodSelectComponent,
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    MatDatepickerModule,
    NgxDatatableModule,
    TranslateModule,
    FontAwesomeModule,
    NgbModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    FilePickerModule,
    NgSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    DragDropModule,
    MatIconModule,
    MatInputModule,
    NgxPrintDirective,
    NgxMatDateFnsModule,
    MatMenu,
    MatMenuTrigger,
    MatButton,
    MatMenuItem,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardTitleGroup,
    MatSidenavModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    DatatableComponent,
    PersonSelectComponent,
    MatSelectionList,
    MatListOption,
    MatCheckbox,
    MatTooltipModule,
    MatProgressSpinner,
    ProsetPermissionDirective,
    ProsetPermissionDirective,
    MatAnchor,
    MatTreeModule,
  ],
  providers: [
    DecimalPipe,
    CurrencyPipe,
    {
      provide: MatDialogRef,
      useValue: { close: () => {} },
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
})
export class ShareModule {}
