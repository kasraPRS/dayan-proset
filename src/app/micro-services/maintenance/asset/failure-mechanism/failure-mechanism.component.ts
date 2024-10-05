import { Component, OnInit } from "@angular/core";
import { FORM_MODE, LIST_EVENTS } from "../../../../share/enums/enums";
import { Config, FieldType } from "../../../../share/datatable/type";
import { FormGroup } from "@angular/forms";
import {
  FailureMechanism,
  FailureMechanismApi,
} from "@proset/maintenance-client";
import { UserPermissions } from "../../../../layouts/menu/enums/menu.enum";
import { FailureMechanismFormComponent } from "./failure-mechanism-form/failure-mechanism-form.component";
import { ProsetDialogService } from "../../../../share/service/proset-dialog.service";
import { ShareService } from "../../../../share/service/share.service";
import { LoaderService } from "../../../../share/service/loader.service";
import { ToastService } from "../../../../share/service/toast.service";
import { EventService } from "../../../../share/service/event.service";
import { finalize } from "rxjs";
import { FormModalComponent } from "../../../../share/modal-component/form-modal/form-modal.component";
import { HttpContext } from "@angular/common/http";
import { SHOW_TOAST } from "../../../../interceptors/exception.interceptor";
import { FailureMechanismListActionType } from "./enum/failure-mechanism-list-action-type";

@Component({
  selector: "proset-failure-mechanism",
  templateUrl: "./failure-mechanism.component.html",
  styleUrl: "./failure-mechanism.component.less",
})
export class FailureMechanismComponent implements OnInit {
  protected FailureMechanismFormComponent = FailureMechanismFormComponent;
  viewType: FORM_MODE = FORM_MODE.CREATE;
  config: Config;
  formGroup: FormGroup;
  failureMechanismDto: FailureMechanism = {};
  permission = UserPermissions;
  tableRow: FailureMechanism[] = [];
  filterNumber: number;
  disableAsset: boolean = false;

  constructor(
    private _failureMechanismApi: FailureMechanismApi,
    private dialogService: ProsetDialogService,
    private shareService: ShareService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private eventService: EventService<LIST_EVENTS>,
  ) {}

  ngOnInit() {
    this.config = this.initFailureMechanismTable();
    this.getAllFailureMechanism();

    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllFailureMechanism();
    });
  }

  getAllFailureMechanism() {
    this.loaderService.setLoading(true);
    this._failureMechanismApi
      .getAllFailureMechanism()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => (this.tableRow = response));
  }

  initFailureMechanismTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "FailureMechanism_Table",
      list: [
        {
          type: FieldType.text,
          id: "FAILURE_MECHANISM_TABLE_CODE",
          label: "FAILURE_MECHANISM.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAILURE_MECHANISM_TABLE_NAME",
          label: "FAILURE_MECHANISM.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 113,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAILURE_MECHANISM_TABLE_ASSET",
          label: "FAILURE_MECHANISM.TABLE.ASSET",
          field: "asset.name",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAILURE_MECHANISM_TABLE_DESCRIPTION",
          label: "FAILURE_MECHANISM.TABLE.DESCRIPTION",
          field: "description",
          minWidth: 50,
          width: 113,
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
          permission: [this.permission.FAILURE_MECHANISM_UPDATE],
          action: (row): void =>
            this.checkInUsed(
              row,
              FailureMechanismListActionType.FAILURE_MECHANISM_UPDATE,
            ),
        },
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.GROUP_DELETE],
          action: (row): void =>
            this.checkInUsed(
              row,
              FailureMechanismListActionType.FAILURE_MECHANISM_DELETE,
            ),
        },
      ],
    };
  }

  showFormInViewMode(row: FailureMechanism): void {
    this.viewType = FORM_MODE.VIEW;
    this.failureMechanismDto = row;
    this.openFailureMechanismForm(row, false);
  }

  openFailureMechanismForm(row: FailureMechanism, editMode: boolean): void {
    this.failureMechanismDto = row;
    if (editMode) {
      this.viewType = FORM_MODE.UPDATE;
    }
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: FailureMechanismFormComponent,
        title: "FAILURE_MECHANISM.TITLE",
        data: {
          disableAsset: this.disableAsset,
          viewType: this.viewType,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.viewType = FORM_MODE.CREATE;
        this.failureMechanismDto = {};
      });
  }

  checkInUsed(
    row: FailureMechanism,
    checkingType: FailureMechanismListActionType,
  ) {
    if (row.id) {
      this.loaderService.setLoading(true);
      this._failureMechanismApi
        .checkFailureMechanismIsInUsed(row.id, "body", false, {
          context: new HttpContext().set(SHOW_TOAST, false),
        })
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: (next) => {
            switch (checkingType) {
              case FailureMechanismListActionType.FAILURE_MECHANISM_DELETE:
                this.deleteRow(row?.id!);
                break;
              case FailureMechanismListActionType.FAILURE_MECHANISM_UPDATE:
                this.openFailureMechanismForm(row, true);
                break;
            }
          },
          error: (error) => {
            switch (checkingType) {
              case FailureMechanismListActionType.FAILURE_MECHANISM_DELETE:
                this.dialogService.showInfo({
                  title: "GENERAL.ERROR_TITLE",
                  contentMessage:
                    "FAILURE_MECHANISM.MESSAGES.FAILURE_MECHANISM_IS_NOT_DELETABLE",
                });
                break;
              case FailureMechanismListActionType.FAILURE_MECHANISM_UPDATE:
                this.disableAsset = true;
                this.openFailureMechanismForm(row, true);
                break;
            }
            return;
          },
        });
    }
  }

  deleteRow(id: number): void {
    this.dialogService
      .showConfirm({
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res && id) {
          this.loaderService.setLoading(true);
          this._failureMechanismApi
            .deleteFailureMechanismById(id)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe({
              next: () => {
                this.getAllFailureMechanism();
                this.dialogService.dismissAll();
                this.toastService.success(
                  "FAILURE_MECHANISM.MESSAGES.FAILURE_MECHANISM_DELETE",
                );
              },
            });
        }
      });
  }
}
