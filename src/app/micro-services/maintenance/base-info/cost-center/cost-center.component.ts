import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { CostCenter, CostCenterApi } from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { EventService } from "src/app/share/service/event.service";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { ToastService } from "src/app/share/service/toast.service";
import { UserPermissions } from "../../../../layouts/menu/enums/menu.enum";
import { Config, FieldType } from "../../../../share/datatable/type";
import { FormModalComponent } from "../../../../share/modal-component/form-modal/form-modal.component";
import { ShareService } from "../../../../share/service/share.service";
import { CostCenterFormComponent } from "./cost-center-form/cost-center-form.component";

@Component({
  selector: "proset-costCenter",
  templateUrl: "./cost-center.component.html",
  styleUrl: "./cost-center.component.less",
})
export class CostCenterComponent implements OnInit {
  protected CostCenterFormComponent = CostCenterFormComponent;
  viewType: FORM_MODE = FORM_MODE.CREATE;
  config: Config;
  formGroup: FormGroup;
  costCenterDto: CostCenter = {};
  permission = UserPermissions;
  tableRow: CostCenter[] = [];
  filterNumber: number;

  ngOnInit(): void {
    this.config = this.initCostCenterTable();
    this.getAllCostCenter();

    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllCostCenter();
    });
  }

  constructor(
    private costCenterApi: CostCenterApi,
    private dialogService: ProsetDialogService,
    private shareService: ShareService,
    private translateService: TranslateService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private eventService: EventService<LIST_EVENTS>,
  ) {}

  /**
   * Retrieves all costCenters from the server.
   *
   * @returns {void}
   */
  getAllCostCenter(): void {
    this.loaderService.setLoading(true);
    this.costCenterApi
      .getAllCostCenter()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => (this.tableRow = response));
  }

  /**
   * Initializes the configuration for the costCenter table.
   *
   * @returns {Config} The configuration object for the costCenter table.
   */
  initCostCenterTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "CostCenter_Table",
      list: [
        {
          type: FieldType.text,
          id: "COST_CENTER_TABLE_CODE",
          label: "COST_CENTER.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "COST_CENTER_TABLE_NAME",
          label: "COST_CENTER.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 113,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "COST_CENTER_TABLE_TYPE",
          label: "COST_CENTER.TABLE.TYPE",
          field: "type",
          minWidth: 50,
          width: 110,
          sortable: false,
          translator: (value) => {
            return this.translateService.instant("COST_CENTER.TYPES." + value);
          },
        },
        {
          type: FieldType.text,
          id: "COST_CENTER_TABLE_DESCRIPTION",
          label: "COST_CENTER.TABLE.DESCRIPTION",
          field: "description",
          minWidth: 50,
          width: 110,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GENERAL_CREATED",
          label: "DATATABLE.CREATED",
          field: "created",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "GENERAL.CREATED_BY",
          label: "DATATABLE.CREATED_BY",
          field: "createdByName",
          minWidth: 50,
          width: 122,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GENERAL_UPDATED",
          label: "DATATABLE.UPDATED",
          field: "updated",
          minWidth: 50,
          width: 152,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "GENERAL_UPDATED",
          label: "DATATABLE.UPDATED_BY",
          field: "updatedByName",
          minWidth: 50,
          width: 142,
          sortable: false,
        },
      ],
      actions: [
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-edit-2",
          tooltip: "DATATABLE.EDIT",
          label: "DATATABLE.EDIT",
          permission: [this.permission.COST_CENTER_UPDATE],
          action: (row): void => this.openCostCenterForm(row, true),
        },
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.COST_CENTER_DELETE],
          action: (row): void => this.deleteRow(row),
        },
      ],
    };
  }

  /**
   * Sets the form in view mode and populates it with the data from the selected row.
   * Disables all form controls and updates their values and validity.
   *
   * @param {CostCenter} row - The selected row data.
   * @returns {void}
   */
  showFormInViewMode(row: CostCenter): void {
    this.viewType = FORM_MODE.VIEW;
    this.costCenterDto = row;
    this.openCostCenterForm(row, false);
  }

  openCostCenterForm(row: CostCenter, editMode: boolean): void {
    this.costCenterDto = row;
    if (editMode) {
      this.viewType = FORM_MODE.UPDATE;
    }
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: CostCenterFormComponent,
        title: "COST_CENTER.TITLE",
        data: {
          viewType: this.viewType,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.viewType = FORM_MODE.CREATE;
        this.costCenterDto = {};
      });
  }

  /**
   * Deletes a costCenter from the server.
   *
   * @param {CostCenter} row - The costCenter object to delete.
   * @returns {void}
   */
  deleteRow(row: CostCenter): void {
    this.dialogService
      .showConfirm({
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res && row?.id) {
          this.loaderService.setLoading(true);
          this.costCenterApi
            .deleteCostCenterById(row?.id)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe({
              next: () => {
                this.getAllCostCenter();
                this.dialogService.dismissAll();
                this.toastService.success(
                  "COST_CENTER.MESSAGES.COST_CENTER_DELETE",
                );
              },
            });
        }
      });
    this.initCostCenterTable();
  }
}
