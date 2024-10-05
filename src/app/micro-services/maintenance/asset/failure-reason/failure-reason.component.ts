import { Component, OnInit } from "@angular/core";
import { FailureReason, FailureReasonApi } from "@proset/maintenance-client";
import { ProsetDialogService } from "../../../../share/service/proset-dialog.service";
import { ShareService } from "../../../../share/service/share.service";
import { LoaderService } from "../../../../share/service/loader.service";
import { ToastService } from "../../../../share/service/toast.service";
import { EventService } from "../../../../share/service/event.service";
import { FORM_MODE, LIST_EVENTS } from "../../../../share/enums/enums";
import { Config, FieldType } from "../../../../share/datatable/type";
import { FormGroup } from "@angular/forms";
import { UserPermissions } from "../../../../layouts/menu/enums/menu.enum";
import { finalize } from "rxjs";
import { FailureReasonFormComponent } from "./failure-reason-form/failure-reason-form.component";
import { FormModalComponent } from "../../../../share/modal-component/form-modal/form-modal.component";
import { HttpContext } from "@angular/common/http";
import { SHOW_TOAST } from "../../../../interceptors/exception.interceptor";
import { FailureReasonListActionType } from "./enum/failure-reason-list-action-type";

@Component({
  selector: "proset-failure-reason",
  templateUrl: "./failure-reason.component.html",
  styleUrl: "./failure-reason.component.less",
})
export class FailureReasonComponent implements OnInit {
  protected FailureReasonFormComponent = FailureReasonFormComponent;
  viewType: FORM_MODE = FORM_MODE.CREATE;
  config: Config;
  formGroup: FormGroup;
  failureReasonDto: FailureReason = {};
  permission = UserPermissions;
  tableRow: FailureReason[] = [];
  filterNumber: number;
  disableAsset: boolean = false;
  constructor(
    private _failureReasonApi: FailureReasonApi,
    private dialogService: ProsetDialogService,
    private shareService: ShareService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private eventService: EventService<LIST_EVENTS>,
  ) {}

  ngOnInit(): void {
    this.config = this.initFailureReasonTable();
    this.getAllFailureReason();

    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllFailureReason();
    });
  }

  getAllFailureReason() {
    this.loaderService.setLoading(true);
    this._failureReasonApi
      .getAllFailureReason()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => (this.tableRow = response));
  }

  initFailureReasonTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "FailureReason_Table",
      list: [
        {
          type: FieldType.text,
          id: "FAILURE_REASON_TABLE_CODE",
          label: "FAILURE_REASON.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAILURE_REASON_TABLE_NAME",
          label: "FAILURE_REASON.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 113,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAILURE_REASON_TABLE_ASSET",
          label: "FAILURE_REASON.TABLE.ASSET",
          field: "asset.name",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAILURE_REASON_TABLE_DESCRIPTION",
          label: "FAILURE_REASON.TABLE.DESCRIPTION",
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
          permission: [this.permission.FAILURE_REASON_UPDATE],
          action: (row): void =>
            this.checkInUsed(
              row,
              FailureReasonListActionType.FAILURE_REASON_UPDATE,
            ),
        },
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.ACTIVITY_DELETE],
          action: (row: FailureReason): void =>
            this.checkInUsed(
              row,
              FailureReasonListActionType.FAILURE_REASON_DELETE,
            ),
        },
      ],
    };
  }

  showFormInViewMode(row: FailureReason): void {
    this.viewType = FORM_MODE.VIEW;
    this.failureReasonDto = row;
    this.openFailureReasonForm(row, false);
  }

  openFailureReasonForm(row: FailureReason, editMode: boolean): void {
    this.failureReasonDto = row;
    if (editMode) {
      this.viewType = FORM_MODE.UPDATE;
    }
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: FailureReasonFormComponent,
        title: "FAILURE_REASON.TITLE",
        data: {
          disableAsset: this.disableAsset,
          viewType: this.viewType,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.viewType = FORM_MODE.CREATE;
        this.failureReasonDto = {};
      });
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
          this._failureReasonApi
            .deleteFailureReasonById(id)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe({
              next: () => {
                this.getAllFailureReason();
                this.dialogService.dismissAll();
                this.toastService.success(
                  "FAILURE_REASON.MESSAGES.FAILURE_REASON_DELETE",
                );
              },
            });
        }
      });
  }

  checkInUsed(row: FailureReason, checkingType: FailureReasonListActionType) {
    if (row.id) {
      this.loaderService.setLoading(true);
      this._failureReasonApi
        .checkFailureReasonIsInUsed(row.id, "body", false, {
          context: new HttpContext().set(SHOW_TOAST, false),
        })
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: (next) => {
            switch (checkingType) {
              case FailureReasonListActionType.FAILURE_REASON_DELETE:
                this.deleteRow(row?.id!);
                break;
              case FailureReasonListActionType.FAILURE_REASON_UPDATE:
                this.openFailureReasonForm(row, true);
                break;
            }
          },
          error: (error) => {
            switch (checkingType) {
              case FailureReasonListActionType.FAILURE_REASON_DELETE:
                this.dialogService.showInfo({
                  title: "GENERAL.ERROR_TITLE",
                  contentMessage:
                    "FAILURE_REASON.MESSAGES.FAILURE_REASON_IS_NOT_DELETABLE",
                });
                break;
              case FailureReasonListActionType.FAILURE_REASON_UPDATE:
                this.disableAsset = true;
                this.openFailureReasonForm(row, true);
                break;
            }
            return;
          },
        });
    }
  }
}
