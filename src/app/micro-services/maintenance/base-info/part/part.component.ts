import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Asset, Part, PartApi } from "@proset/maintenance-client";
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
import { PartFormComponent } from "./part-form/part-form.component";

@Component({
  selector: "proset-part",
  templateUrl: "./part.component.html",
  styleUrl: "./part.component.less",
})
export class PartComponent implements OnInit {
  protected PartFormComponent = PartFormComponent;
  viewType: FORM_MODE = FORM_MODE.CREATE;
  config: Config;
  formGroup: FormGroup;
  partDto: Part = {};
  permission = UserPermissions;
  tableRow: Part[] = [];
  selectedAssetForSearch: Asset[];
  isDuplicatedCode = false;
  filterNumber: number;

  ngOnInit(): void {
    this.config = this.initPartTable();
    this.getAllPart();

    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllPart();
    });
  }

  constructor(
    private partApi: PartApi,
    private router: Router,
    private dialogService: ProsetDialogService,
    private shareService: ShareService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private eventService: EventService<LIST_EVENTS>,
  ) {}

  /**
   * Retrieves all parts from the server.
   *
   * @returns {void}
   */
  getAllPart(): void {
    this.loaderService.setLoading(true);
    this.partApi
      .getAllPart()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => (this.tableRow = response));
  }

  /**
   * Initializes the configuration for the part table.
   *
   * @returns {Config} The configuration object for the part table.
   */
  initPartTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Part_Table",
      list: [
        {
          type: FieldType.text,
          id: "PART_TABLE_CODE",
          label: "PART.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PART_TABLE_NAME",
          label: "PART.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 113,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PART_TABLE_DESCRIPTION",
          label: "PART.TABLE.DESCRIPTION",
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
          permission: [this.permission.PART_UPDATE],
          action: (row): void => this.updateRow(row),
        },
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.PART_DELETE],
          action: (row): void => this.deleteRow(row),
        },
      ],
    };
  }

  updateRow(row: any) {
    this.router.navigate([
      "maintenance/base-info/part/form",
      FORM_MODE.UPDATE,
      row.id,
    ]);
  }

  /**
   * Sets the form in view mode and populates it with the data from the selected row.
   * Disables all form controls and updates their values and validity.
   *
   * @param {Part} row - The selected row data.
   * @returns {void}
   */
  showFormInViewMode(row: Part): void {
    this.router.navigate([
      "maintenance/base-info/part/form",
      FORM_MODE.VIEW,
      row.id,
    ]);
  }

  openPartForm(row: Part, editMode: boolean): void {
    this.partDto = row;
    if (editMode) {
      this.viewType = FORM_MODE.UPDATE;
    }
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: PartFormComponent,
        title: "PART.TITLE",
        data: {
          viewType: this.viewType,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.viewType = FORM_MODE.CREATE;
        this.partDto = {};
      });
  }

  /**
   * Deletes a part from the server.
   *
   * @param {Part} row - The part object to delete.
   * @returns {void}
   */
  deleteRow(row: Part): void {
    this.dialogService
      .showConfirm({
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res && row?.id) {
          this.loaderService.setLoading(true);
          this.partApi
            .deletePartById(row?.id)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe({
              next: () => {
                this.getAllPart();
                this.dialogService.dismissAll();
                this.toastService.success("PART.MESSAGES.PART_DELETE");
              },
            });
        }
      });
    this.initPartTable();
  }
}
