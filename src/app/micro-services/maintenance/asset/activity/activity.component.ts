import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Activity, ActivityApi } from "@proset/maintenance-client";
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
import { ActivityFormComponent } from "./activity-form/activity-form.component";

@Component({
  selector: "proset-activity",
  templateUrl: "./activity.component.html",
  styleUrl: "./activity.component.less",
})
export class ActivityComponent implements OnInit {
  protected ActivityFormComponent = ActivityFormComponent;
  viewType: FORM_MODE = FORM_MODE.CREATE;
  config: Config;
  formGroup: FormGroup;
  permission = UserPermissions;
  tableRow: Activity[] = [];
  activityDto: Activity = {};

  ngOnInit(): void {
    this.config = this.initActivityTable();
    this.getAllActivity();

    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllActivity();
    });
  }

  constructor(
    private activityApi: ActivityApi,
    private dialogService: ProsetDialogService,
    private shareService: ShareService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private eventService: EventService<LIST_EVENTS>,
  ) {}

  /**
   * Retrieves all activities from the server.
   *
   * @returns {void}
   */
  getAllActivity(): void {
    this.loaderService.setLoading(true);
    this.activityApi
      .getAllActivity()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => (this.tableRow = response));
  }

  /**
   * Initializes the configuration for the activity table.
   *
   * @returns {Config} The configuration object for the activity table.
   */
  initActivityTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Activity_Table",
      list: [
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "ACTIVITY.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_NAME",
          label: "ACTIVITY.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_ASSET",
          label: "ACTIVITY.TABLE.ASSET",
          field: "asset.name",
          minWidth: 50,
          width: 113,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_NUMBER_PLATE",
          label: "ACTIVITY.TABLE.NUMBER_PLATE",
          field: "asset.code",
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
          permission: [this.permission.ACTIVITY_UPDATE],
          label: "DATATABLE.EDIT",
          action: (row): void => this.openActivityForm(row, true),
        },
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          permission: [this.permission.ACTIVITY_DELETE],
          label: "DATATABLE.DELETE",
          action: (row): void => this.deleteRow(row),
        },
      ],
    };
  }

  /**
   * Sets the form in view mode and populates it with the data from the selected row.
   * Disables all form controls and updates their values and validity.
   *
   * @param {Activity} row - The selected row data.
   * @returns {void}
   */
  showFormInViewMode(row: Activity): void {
    this.viewType = FORM_MODE.VIEW;
    this.activityDto = row;
    this.openActivityForm(row, false);
  }

  openActivityForm(row: Activity, editMode: boolean): void {
    this.activityDto = row;
    if (editMode) {
      this.viewType = FORM_MODE.UPDATE;
    }
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: ActivityFormComponent,
        title: "ACTIVITY.TITLE",
        data: {
          viewType: this.viewType,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.viewType = FORM_MODE.CREATE;
        this.activityDto = {};
        if (editMode) this.getAllActivity();
      });
  }

  /**
   * Deletes a activity from the server.
   *
   * @param {Activity} row - The activity object to delete.
   * @returns {void}
   */
  deleteRow(row: Activity): void {
    this.dialogService
      .showConfirm({
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res && row?.id) {
          this.loaderService.setLoading(true);
          this.activityApi
            .deleteActivityById(row?.id)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe({
              next: () => {
                this.getAllActivity();
                this.dialogService.dismissAll();
                this.toastService.success("ACTIVITY.MESSAGES.ACTIVITY_DELETE");
              },
            });
        }
      });
    this.initActivityTable();
  }
}
