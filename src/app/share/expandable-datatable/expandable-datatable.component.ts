import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { AnyObject, Config } from "../datatable/type";
import { DatatableModel } from "../datatable/datatable.model";
import {
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
} from "@angular/common";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableActionComponent } from "../datatable/datatable-action/datatable-action.component";
import { DatatableFieldComponent } from "../datatable/datatable-field/datatable-field.component";
import { ProsetDatatableDblClickDirective } from "../datatable/column-selector/datateble-double-click";

@Component({
  selector: "proset-expandable-datatable",
  templateUrl: "./expandable-datatable.component.html",
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
  ],
  styleUrls: ["./expandable-datatable.component.less"],
})
export class ExpandableDatatableComponent implements OnInit {
  @Input() limit: number;
  @Input() tableRow: any[];
  @Input() selected: any[];
  @Input() public filteredListenData: AnyObject[];
  @Input() tableColumns: DatatableModel[];
  @Input() actionButton: DatatableModel[];
  @Input() checkBoxable: boolean;
  @Input() displaySelectAllCheckbox: boolean;
  @Input() isAllEntriesSelected: boolean;
  @Input() showIndex: boolean;
  @Input() scrollbarV: boolean;
  @Input() scrollbarH: boolean;
  @Input() loading: boolean;
  @Input() viewOnly: boolean;
  @Input() filterable: boolean;
  @Input() detail: TemplateRef<any>;
  @Input() config: Config = {};
  @Input() sortable: boolean;
  @Output() onRowSelect = new EventEmitter<any>();
  @Output() onRowActivate = new EventEmitter<any>();
  @Output() onAllEntriesSelected = new EventEmitter<boolean>();
  @Output() onAllEntriesSelectedExclude = new EventEmitter<AnyObject>();

  loadingIndicator = true;
  tableHeight: number | false;
  messages = {
    emptyMessage: "",
    totalMessage: "",
  };

  @ViewChild("datatable") table: any;

  constructor() {}

  ngOnInit(): void {}

  toggleExpandRow(row: any) {
    this.table.rowDetail.toggleExpandRow(row);
    this.onRowSelect.emit(row);
  }

  isConfigList(): boolean {
    return this.tableRow.length >= this.limit ? true : false;
  }

  onSelect(event: any) {
    this.onRowSelect.emit(this.selected);
  }

  onActivate(event: any) {
    if (event.type === "mouseover") {
      //TODO: here should be apply mouse over css
    } else if (event.type === "click" && !this.checkBoxable) {
      this.onRowActivate.emit(event.row);
    }
  }
}
