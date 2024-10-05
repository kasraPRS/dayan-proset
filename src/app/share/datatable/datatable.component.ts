import {
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
} from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NgxDatatableModule, SelectionType } from "@swimlane/ngx-datatable";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE } from "../enums/enums";
import { FormModalComponent } from "../modal-component/form-modal/form-modal.component";
import { ProsetPermissionDirective } from "../security/proset-permission.directive";
import { DialogService } from "../service/dialogservice";
import { ProsetDialogService } from "../service/proset-dialog.service";
import { SidebarService } from "../sidebar-filter/sidebar-service";
import { ColumnSelectorComponent } from "./column-selector/column-selector.component";
import { ProsetDatatableDblClickDirective } from "./column-selector/datateble-double-click";
import { DatatableActionComponent } from "./datatable-action/datatable-action.component";
import { DatatableFieldComponent } from "./datatable-field/datatable-field.component";
import { DatatableModel } from "./datatable.model";
import { ExportService } from "./export.service";
import { AnyObject, Column, Config } from "./type";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: "app-datatable",
  templateUrl: "./datatable.component.html",
  styleUrls: ["./datatable.component.less"],
  standalone: true,
  imports: [
    NgIf,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatDialogModule,
    TranslateModule,
    NgTemplateOutlet,
    NgClass,
    NgStyle,
    NgxDatatableModule,
    DatatableActionComponent,
    DatatableFieldComponent,
    ProsetDatatableDblClickDirective,
    NgForOf,
    ProsetPermissionDirective,
    MatIconButton,
    MatButton,
    MatDivider,
  ],
})
export class DatatableComponent implements OnInit {
  @Input() limit: number;
  @Input() selected: any[] = [];
  @Input() public filteredListenData: AnyObject[];
  @Input() tableColumns: DatatableModel[];
  @Input() actionButton: DatatableModel[];
  @Input() checkBoxable = false;
  @Input() displaySelectAllCheckbox = false;
  @Input() isAllEntriesSelected: boolean;
  @Input() showIndex: boolean;
  @Input() scrollbarV: boolean;
  @Input() scrollbarH: boolean;
  @Input() loading: boolean;
  @Input() viewOnly: boolean;
  @Input() showNewBtn: boolean;
  @Input() config: Config = {};
  @Input() hasDetail = true;
  @Input() actionTemplate: TemplateRef<any>;
  @Input() filterTemplate: TemplateRef<FormGroup>;
  @Input() formTitle: string;
  @Input() newEntryPermission: UserPermissions[];

  private _tableRow: any[] = [];
  @Input()
  get tableRow(): any[] {
    return _.sortBy(this._tableRow, "code");
  }

  set tableRow(value: any[]) {
    this._tableRow = value;
  }

  tempRecordArray: any[];
  private _newEntryFormTemplate: any;
  set newEntryFormTemplate(reference: any) {
    this._newEntryFormTemplate = reference;
  }

  @Input() get newEntryFormTemplate() {
    return this._newEntryFormTemplate;
  }

  @Input() singleRowClick = false;
  @Input() showToolbar = true;
  @Input() showFilter = true;
  @Input() excelData: any[];
  @Input() dragAndDrop: boolean;
  @Input() newWindowUrl: string;
  @Input() apiCall: Observable<any>;
  @Input() filterNumber: number;
  @Output()
  onRowSelect = new EventEmitter<any>();
  @Output() onRowActivate = new EventEmitter<any>();
  @Output() onAllEntriesSelected = new EventEmitter<boolean>();
  @Output() onAllEntriesSelectedExclude = new EventEmitter<AnyObject>();
  @Output() onDoubleClickRow = new EventEmitter<any>();
  @Output() onNewEntryForm = new EventEmitter<TemplateRef<any>>();
  @Output() onFilterForm = new EventEmitter<void>();

  @ViewChild("datatable") datatable: ElementRef;
  allColumnList: Column[];
  loadingIndicator = true;
  enableSelectExcludeMode = false;
  tableHeight: number | false;
  messages = {
    emptyMessage: "",
    totalMessage: "",
  };
  selectionType = SelectionType;

  constructor(
    private dialogService: DialogService,
    private exportService: ExportService,
    private sidebarService: SidebarService,
    private prosetDialogService: ProsetDialogService,
    private translateService: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.allColumnList = this.config.list || [];
    this.tableHeight =
      _.size(this.tableRow) >= this.limit &&
      _.add(_.multiply(this.limit, 50), 60);
    this.translateService
      .get("GENERAL.NOT_FOUND_MESSAGE")
      .subscribe((translate) => {
        this.messages.emptyMessage = translate;
      });
    this.translateService.get("GENERAL.ROW").subscribe((translate) => {
      this.messages.totalMessage = translate;
    });
  }

  onSelect(event: any) {
    this.onRowSelect.emit(event);
  }

  onActivate(event: any) {
    if (event.type === "mouseover") {
      //TODO: here should be apply mouse over css
    } else if (event.type === "click" && !this.checkBoxable) {
      this.onRowActivate.emit(event.row);
    }
  }

  toggleRowCheckbox(event: any, row: any): void {
    const isChecked = event?.target?.checked;
    if (isChecked) {
      this.selected = this.addItemsToArray(this.selected, [row]);
    } else {
      this.selected = this.removeItemsFromArray(this.selected, [row]);
    }

    if (this.isAllEntriesSelected && !isChecked) {
      // change to exclude select mode only if all rows are selected and then any row is deselected
      this.enableSelectExcludeMode = true;

      this.isAllEntriesSelected = false;
      this.onAllEntriesSelected.emit(this.isAllEntriesSelected);
    }

    if (!this.enableSelectExcludeMode) {
      this.onAllEntriesSelectedExclude.emit([]);
      this.onRowSelect.emit(this.selected);
    }
  }

  private addItemsToArray(array: any[], itemsToBeAdded: any[]): any[] {
    const newUniqueItemsToBeAdded = this.removeItemsFromArray(
      itemsToBeAdded,
      array,
    );
    return [...array, ...newUniqueItemsToBeAdded];
  }

  private removeItemsFromArray(array: any[], itemsToBeRemoved: any[]): any[] {
    return array.filter((item) => !this.isItemInArray(item, itemsToBeRemoved));
  }

  private isItemInArray(item: any, array: any[]): boolean {
    return array?.findIndex((i) => i.id === item.id) >= 0;
  }

  onCheckboxAble() {
    this.checkBoxable = !this.checkBoxable;
  }

  onColumnToggle() {
    this.dialogService
      .showWithComponent(ColumnSelectorComponent, {
        size: "l",
        data: this.allColumnList,
      })
      .result.then((response: Column[]) => {
        if (response && response.length > 0) {
          this.config.list = response;
        }
      });
  }

  onExportExcel() {
    /* generate workbook and add the worksheet */
    let rows = this.excelData || this.tableRow || [];
    const excelFileName: string =
      this.config.excelFileName || this.config.id || " ";
    this.exportService.exportToExcel(excelFileName, rows, this.config);
  }

  onDoubleClick(event: any) {
    this.onDoubleClickRow.emit(event);
  }

  onNewEntry(): void {
    this.onNewEntryForm.emit();
    if (this.newEntryFormTemplate) {
      this.prosetDialogService.showWithFormComponent(FormModalComponent, {
        referenceContent: this.newEntryFormTemplate,
        title: this.formTitle,
        data: {
          viewType: FORM_MODE.CREATE,
        },
      });
    } else if (this.newWindowUrl) {
      this.router.navigate([this.newWindowUrl]);
    }
  }

  onFilter(): void {
    this.sidebarService.set_sidenavMode(true);
  }

  onSearchColumn(event: any, col: Column) {
    this.tableRow = this.tempRecordArray;
    this.tableRow = _.filter(this.tableRow, (row) => {
      let field = Object.getOwnPropertyNames(row).filter(
        (field) => field === col.field,
      )[0];
      return event ? row[field].includes(event.currentTarget.value) : row;
    });
  }

  calcPages(page?: number): number[] {
    let pages: number[] = [1];
    let pageNumber = this.tableRow.length / 10;
    pages.push(2);
    pages.push(3);
    return pages;
  }
}
