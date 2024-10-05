import { Component } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { WorkRequestApi, WorkRequestStatus } from "@proset/maintenance-client";
import { WorkRequestResponse } from "@proset/maintenance-client/model/workRequestResponse";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { Config, FieldType } from "src/app/share/datatable/type";
import { FORM_MODE } from "src/app/share/enums/enums";
import { flattenObject } from "src/app/share/helper/flatten";
import { ShareService } from "src/app/share/service/share.service";
import { ToastService } from "src/app/share/service/toast.service";
import { SidebarService } from "src/app/share/sidebar-filter/sidebar-service";
import { LoaderService } from "../../../../../share/service/loader.service";
import { ProsetDialogService } from "../../../../../share/service/proset-dialog.service";

@Component({
  selector: "proset-request-list",
  templateUrl: "./work-request-list.component.html",
  styleUrl: "./work-request-list.component.less",
})
export class WorkRequestListComponent {
  config: Config;
  form: FormGroup;
  requestList: WorkRequestResponse[];
  filterNumber: number;
  statusItemList: string[] = Object.keys(WorkRequestStatus);
  selectedRequest: WorkRequestResponse;
  status = WorkRequestStatus;

  permission = UserPermissions;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private requestApi: WorkRequestApi,
    private dialogService: ProsetDialogService,
    private sidebarService: SidebarService,
    private shareService: ShareService,
    private toastService: ToastService,
    private _router: Router,
    private _loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.config = this.initRquestTable();
    this.onSearchRequest({});
    this.form
      .get("toCode")
      ?.setValidators([this.toCodeValidator(this.form.get("fromCode")!)]);
    this.onFromCodeChange();
  }

  initForm() {
    this.form = this.formBuilder.group({
      fromCode: [null],
      toCode: [null],
      fromDate: [null],
      toDate: [null],
      status: [null],
    });
  }

  onFromCodeChange() {
    this.form.get("fromCode")?.valueChanges.subscribe(() => {
      this.form.get("toCode")?.updateValueAndValidity();
    });
  }

  toCodeValidator(fromCodeControl: AbstractControl) {
    return (toCodeControl: AbstractControl): { [key: string]: any } | null => {
      const fromCodeValue = fromCodeControl.value;
      const toCodeValue = toCodeControl.value;
      if (toCodeValue !== null) {
        if (toCodeControl.value !== "" && toCodeValue < fromCodeValue) {
          return { invalidToCode: true };
        }
      } else {
        return { invalidToCode: false };
      }
      return null;
    };
  }

  onSearchRequest(args: any) {
    this._loader.setLoading(true);
    this.requestApi
      .searchWorkRequest(flattenObject(args))
      .pipe(finalize(() => this._loader.setLoading(false)))
      .subscribe((response: any) => {
        this.requestList = response;
      });
  }

  updateRow(row: WorkRequestResponse) {
    if (row.status === WorkRequestStatus.WAIT_FOR_ACCEPT) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([
          "maintenance/maintenance/work-request/",
          FORM_MODE.UPDATE,
          row.id,
        ]),
      );
      this._router.navigateByUrl(url);
    } else {
      this.dialogService.showInfo({
        title: "GENERAL.ERROR_TITLE",
        contentMessage: "REQUEST.MESSAGES.WORK_REQUEST_NOT_UPDATABLE",
      });
    }
  }

  onDoubleClick(row: WorkRequestResponse) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        "/maintenance/maintenance/work-request/",
        FORM_MODE.VIEW,
        row.id,
      ]),
    );
    this._router.navigateByUrl(url);
  }

  onRowActivate(row: WorkRequestResponse) {
    this.selectedRequest = row;
  }

  deleteRequestById(row: WorkRequestResponse): void {
    if (row.status === WorkRequestStatus.WAIT_FOR_ACCEPT) {
      this.dialogService
        .showConfirm({
          contentMessage: "MESSAGES.DELETE_CONFIRM",
        })
        .afterClosed()
        .subscribe((response) => {
          if (response && row.id) {
            this.requestApi.deleteWorkRequestById(row.id).subscribe({
              next: (): void => {
                this.toastService.success("REQUEST.MESSAGES.DELETE_SUCCESS");
                this.onSearchRequest({});
              },
              error: (): void => {
                this.toastService.error("REQUEST.MESSAGES.DELETE_FAIL");
              },
            });
          }
        });
    } else {
      this.dialogService.showInfo({
        title: "GENERAL.ERROR_TITLE",
        contentMessage: "REQUEST.MESSAGES.WORK_REQUEST_NOT_DELETABLE",
      });
    }
  }

  onFilterForm(event: any) {
    if (event.isReset) {
      this.form.reset();
      this.filterNumber = 0;
    }
    let formValue = flattenObject(this.form.value);
    this.filterNumber = this.sidebarService.updateFilterList(formValue).length;
    let filter = { ...this.form.value, ...event.value };
    this.onSearchRequest(filter);
  }

  onFilter(): void {
    this.sidebarService.set_sidenavMode(true);
  }

  initRquestTable(): Config {
    return {
      id: "REQUEST_TABLE",
      limitPerPage: 0,
      pagination: true,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      list: [
        {
          type: FieldType.text,
          id: "NUMBER",
          label: "REQUEST.TABLE.NUMBER",
          field: "code",
          minWidth: 100,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "DATE",
          label: "REQUEST.TABLE.DATE",
          field: "issueDate",
          minWidth: 100,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "TITLE",
          label: "REQUEST.TABLE.TITLE",
          field: "name",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REQUESTER",
          label: "REQUEST.TABLE.REQUESTER",
          field: "applicant.name",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REQUESTER",
          label: "REQUEST.TABLE.REQUESTER_CODE",
          field: "applicant.code",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ASSET",
          label: "REQUEST.TABLE.ASSET",
          field: "asset.name",
          minWidth: 100,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "NUMBER_PLATE",
          label: "REQUEST.TABLE.NUMBER_PLATE",
          field: "asset.code",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "EMPLACEMENT_LOCATION",
          label: "REQUEST.TABLE.EMPLACEMENT_LOCATION",
          field: "emplacementLocation",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.url,
          id: "WORKORDER_NUMBER",
          label: "REQUEST.TABLE.WORKORDER_NUMBER",
          field: "workOrderCode",
          minWidth: 100,
          width: 150,
          sortable: false,
          url: "/maintenance/maintenance/work-order/request/view",
        },
        {
          type: FieldType.text,
          id: "WORKORDER_STATUS",
          label: "REQUEST.TABLE.WORKORDER_STATUS",
          field: "workOrderStatus",
          minWidth: 100,
          width: 150,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("WORK_ORDERS.STATUS." + value)
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "PRIORITY",
          label: "REQUEST.TABLE.PRIORITY",
          field: "priority",
          minWidth: 100,
          width: 100,
          sortable: false,
          url: "",
          translator: (value) => {
            return value
              ? this.translateService.instant("PRIORITY." + value)
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_REPAIR_PERSONNEL",
          label: "REQUEST.TABLE.FAILURE_LIST",
          field: "failureModeList",
          minWidth: 50,
          width: 100,
          sortable: false,
          commaSeperatedToolTipFiledName: "name",
          translator: (value) => {
            let translate = "";
            translate = this.translateService.instant("REQUEST.TABLE.FAILURE");
            return value.length.toString().concat(" ").concat(translate);
          },
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_REPAIR_PERSONNEL",
          label: "REQUEST.TABLE.FAILURE_DETECTION",
          field: "failureDetectionMethod.name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GENERAL_CREATED",
          label: "DATATABLE.CREATED",
          field: "created",
          minWidth: 50,
          width: 150,
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
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GENERAL_UPDATED",
          label: "DATATABLE.UPDATED",
          field: "updated",
          minWidth: 50,
          width: 150,
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
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "status",
          label: "REQUEST.TABLE.STATUS",
          field: "status",
          minWidth: 50,
          width: 150,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("REQUEST.STATUS." + value)
              : "-";
          },
        },
      ],
      actions: [
        {
          id: "EDIT",
          icon: "isax isax-edit-2",
          tooltip: "DATATABLE.EDIT",
          permission: [this.permission.WORK_REQUEST_UPDATE],
          label: "DATATABLE.EDIT",
          action: (row: WorkRequestResponse): void => this.updateRow(row),
        },
        {
          id: "delete",
          icon: "isax isax-trash",
          tooltip: "GENERAL.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.WORK_REQUEST_DELETE],
          action: (row: WorkRequestResponse): void =>
            this.deleteRequestById(row),
        },
      ],
    };
  }
}
