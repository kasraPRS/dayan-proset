import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Level, LevelApi } from "@proset/maintenance-client";
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
import { LevelFormComponent } from "./level-form/level-form.component";

@Component({
  selector: "proset-level",
  templateUrl: "./level.component.html",
  styleUrl: "./level.component.less",
})
export class LevelComponent implements OnInit {
  protected LevelFormComponent = LevelFormComponent;
  viewType: FORM_MODE = FORM_MODE.CREATE;
  config: Config;
  formGroup: FormGroup;
  levelDto: Level = {};
  permission = UserPermissions;
  tableRow: Level[] = [];
  filterNumber: number;

  ngOnInit(): void {
    this.config = this.initLevelTable();
    this.getAllLevel();

    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllLevel();
    });
  }

  constructor(
    private levelApi: LevelApi,
    private dialogService: ProsetDialogService,
    private shareService: ShareService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private eventService: EventService<LIST_EVENTS>,
  ) {}

  /**
   * Retrieves all levels from the server.
   *
   * @returns {void}
   */
  getAllLevel(): void {
    this.loaderService.setLoading(true);
    this.levelApi
      .getAllLevel()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => (this.tableRow = response));
  }

  /**
   * Initializes the configuration for the level table.
   *
   * @returns {Config} The configuration object for the level table.
   */
  initLevelTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Level_Table",
      list: [
        {
          type: FieldType.text,
          id: "LEVEL_TABLE_CODE",
          label: "LEVEL.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "LEVEL_TABLE_NAME",
          label: "LEVEL.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 113,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "LEVEL_TABLE_DESCRIPTION",
          label: "LEVEL.TABLE.DESCRIPTION",
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
          permission: [this.permission.LEVEL_UPDATE],
          action: (row): void => this.openLevelForm(row, true),
        },
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.LEVEL_DELETE],
          action: (row): void => this.deleteRow(row),
        },
      ],
    };
  }

  /**
   * Sets the form in view mode and populates it with the data from the selected row.
   * Disables all form controls and updates their values and validity.
   *
   * @param {Level} row - The selected row data.
   * @returns {void}
   */
  showFormInViewMode(row: Level): void {
    this.viewType = FORM_MODE.VIEW;
    this.levelDto = row;
    this.openLevelForm(row, false);
  }

  openLevelForm(row: Level, editMode: boolean): void {
    this.levelDto = row;
    if (editMode) {
      this.viewType = FORM_MODE.UPDATE;
    }
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: LevelFormComponent,
        title: "LEVEL.TITLE",
        data: {
          viewType: this.viewType,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.viewType = FORM_MODE.CREATE;
        this.levelDto = {};
      });
  }

  /**
   * Deletes a level from the server.
   *
   * @param {Level} row - The level object to delete.
   * @returns {void}
   */
  deleteRow(row: Level): void {
    this.dialogService
      .showConfirm({
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res && row?.id) {
          this.loaderService.setLoading(true);
          this.levelApi
            .deleteLevelById(row?.id)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe({
              next: (value) => {
                this.getAllLevel();
                this.dialogService.dismissAll();
                this.toastService.success("LEVEL.MESSAGES.LEVEL_DELETE");
              },
            });
        }
      });
    this.initLevelTable();
  }
}
