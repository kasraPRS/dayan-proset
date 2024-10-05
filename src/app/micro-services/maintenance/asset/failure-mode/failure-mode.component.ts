import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FailureMode, FailureModeApi } from "@proset/maintenance-client";
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
import { FailureModeFormComponent } from "./failure-mode-form/failure-mode-form.component";

@Component({
  selector: "proset-failure-mode",
  templateUrl: "./failure-mode.component.html",
  styleUrl: "./failure-mode.component.less",
})
export class FailureModeComponent implements OnInit {
  protected FailureModeFormComponent = FailureModeFormComponent;
  viewType: FORM_MODE = FORM_MODE.CREATE;
  config: Config;
  formGroup: FormGroup;
  failureModeDto: FailureMode = {};
  permission = UserPermissions;
  tableRow: FailureMode[] = [];
  filterNumber: number;

  ngOnInit(): void {
    this.config = this.initFailureModeTable();
    this.getAllFailureMode();

    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllFailureMode();
    });
  }

  constructor(
    private failureModeApi: FailureModeApi,
    private dialogService: ProsetDialogService,
    private shareService: ShareService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private eventService: EventService<LIST_EVENTS>,
  ) {}

  /**
   * Retrieves all failureModes from the server.
   *
   * @returns {void}
   */
  getAllFailureMode(): void {
    this.loaderService.setLoading(true);
    this.failureModeApi
      .getAllFailureMode()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => (this.tableRow = response));
  }

  /**
   * Initializes the configuration for the failureMode table.
   *
   * @returns {Config} The configuration object for the failureMode table.
   */
  initFailureModeTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "FailureMode_Table",
      list: [
        {
          type: FieldType.text,
          id: "FAILURE_MODE_TABLE_CODE",
          label: "FAILURE_MODE.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAILURE_MODE_TABLE_NAME",
          label: "FAILURE_MODE.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 113,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ASSET",
          label: "FAILURE_MODE.TABLE.ASSET",
          field: "asset.name",
          minWidth: 100,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAILURE_MODE_TABLE_DESCRIPTION",
          label: "FAILURE_MODE.TABLE.DESCRIPTION",
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
          permission: [this.permission.FAILURE_MODE_UPDATE],
          action: (row): void => this.openFailureModeForm(row, true),
        },
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.FAILURE_MODE_DELETE],
          action: (row): void => this.deleteRow(row),
        },
      ],
    };
  }

  /**
   * Sets the form in view mode and populates it with the data from the selected row.
   * Disables all form controls and updates their values and validity.
   *
   * @param {FailureMode} row - The selected row data.
   * @returns {void}
   */
  showFormInViewMode(row: FailureMode): void {
    this.viewType = FORM_MODE.VIEW;
    this.failureModeDto = row;
    this.openFailureModeForm(row, false);
  }

  openFailureModeForm(row: FailureMode, editMode: boolean): void {
    this.failureModeDto = row;
    if (editMode) {
      this.viewType = FORM_MODE.UPDATE;
    }
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: FailureModeFormComponent,
        title: "FAILURE_MODE.TITLE",
        width: "400px",
        data: {
          viewType: this.viewType,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.viewType = FORM_MODE.CREATE;
        this.failureModeDto = {};
      });
  }

  /**
   * Deletes a failureMode from the server.
   *
   * @param {FailureMode} row - The failureMode object to delete.
   * @returns {void}
   */
  deleteRow(row: FailureMode): void {
    this.dialogService
      .showConfirm({
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
        width: 400,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res && row?.id) {
          this.loaderService.setLoading(true);
          this.failureModeApi
            .deleteFailureModeById(row?.id)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe({
              next: () => {
                this.getAllFailureMode();
                this.dialogService.dismissAll();
                this.toastService.success(
                  "FAILURE_MODE.MESSAGES.FAILURE_MODE_DELETE",
                );
              },
            });
        }
      });
    this.initFailureModeTable();
  }
}
