import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Group, GroupApi } from "@proset/maintenance-client";
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
import { GroupFormComponent } from "./group-form/group-form.component";

@Component({
  selector: "proset-group",
  templateUrl: "./group.component.html",
  styleUrl: "./group.component.less",
})
export class GroupComponent implements OnInit {
  protected GroupFormComponent = GroupFormComponent;
  viewType: FORM_MODE = FORM_MODE.CREATE;
  config: Config;
  formGroup: FormGroup;
  groupDto: Group = {};
  permission = UserPermissions;
  tableRow: Group[] = [];
  filterNumber: number;

  ngOnInit(): void {
    this.config = this.initGroupTable();
    this.getAllGroup();

    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllGroup();
    });
  }

  constructor(
    private groupApi: GroupApi,
    private dialogService: ProsetDialogService,
    private shareService: ShareService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private eventService: EventService<LIST_EVENTS>,
  ) {}

  /**
   * Retrieves all groups from the server.
   *
   * @returns {void}
   */
  getAllGroup(): void {
    this.loaderService.setLoading(true);
    this.groupApi
      .getAllGroup()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => (this.tableRow = response));
  }

  /**
   * Initializes the configuration for the group table.
   *
   * @returns {Config} The configuration object for the group table.
   */
  initGroupTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Group_Table",
      list: [
        {
          type: FieldType.text,
          id: "GROUP_TABLE_CODE",
          label: "GROUP.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GROUP_TABLE_NAME",
          label: "GROUP.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 113,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GROUP_TABLE_LEVEL",
          label: "GROUP.TABLE.LEVEL",
          field: "level.name",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GROUP_TABLE_DESCRIPTION",
          label: "GROUP.TABLE.DESCRIPTION",
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
          permission: [this.permission.GROUP_UPDATE],
          action: (row): void => this.openGroupForm(row, true),
        },
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.GROUP_DELETE],
          action: (row): void => this.deleteRow(row),
        },
      ],
    };
  }

  /**
   * Sets the form in view mode and populates it with the data from the selected row.
   * Disables all form controls and updates their values and validity.
   *
   * @param {Group} row - The selected row data.
   * @returns {void}
   */
  showFormInViewMode(row: Group): void {
    this.viewType = FORM_MODE.VIEW;
    this.groupDto = row;
    this.openGroupForm(row, false);
  }

  openGroupForm(row: Group, editMode: boolean): void {
    this.groupDto = row;
    if (editMode) {
      this.viewType = FORM_MODE.UPDATE;
    }
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: GroupFormComponent,
        title: "GROUP.TITLE",
        data: {
          viewType: this.viewType,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.viewType = FORM_MODE.CREATE;
        this.groupDto = {};
      });
  }

  /**
   * Deletes a group from the server.
   *
   * @param {Group} row - The group object to delete.
   * @returns {void}
   */
  deleteRow(row: Group): void {
    this.dialogService
      .showConfirm({
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res && row?.id) {
          this.loaderService.setLoading(true);
          this.groupApi
            .deleteGroupById(row?.id)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe({
              next: () => {
                this.getAllGroup();
                this.dialogService.dismissAll();
                this.toastService.success("GROUP.MESSAGES.GROUP_DELETE");
              },
            });
        }
      });
    this.initGroupTable();
  }
}
