import { Component, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import {
  Asset,
  MainInfo,
  Person,
  Priority,
  UserType,
  WorkOrder,
  WorkOrderApi,
  WorkOrderStatus,
  WorkOrderType,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { ColumnTooltip, Config, FieldType } from "src/app/share/datatable/type";
import { FORM_MODE } from "src/app/share/enums/enums";
import { assignPriorityColorToEvent } from "src/app/share/helper/business-colors";
import { flattenObject } from "src/app/share/helper/flatten";
import {
  KanbanCardActionType,
  KanbanColumnType,
} from "src/app/share/kanban/types/type";
import { CalendarEvent } from "src/app/share/model/calendar-event";
import { HistorySearchParameter } from "src/app/share/model/history-search-parameter";
import { TaskType } from "src/app/share/model/task";
import { LoaderService } from "src/app/share/service/loader.service";
import { ShareService } from "src/app/share/service/share.service";
import { ToastService } from "src/app/share/service/toast.service";
import { SidebarService } from "src/app/share/sidebar-filter/sidebar-service";
import { FilterSearchModel } from "../model/filter-search-model";
import { LIST_VIEW_TYPE } from "./enums/enums";
import { ProsetDialogService } from "../../../../../share/service/proset-dialog.service";

@Component({
  selector: "proset-work-order-list",
  templateUrl: "./work-order-list.component.html",
  styleUrl: "./work-order-list.component.less",
})
export class WorkOrderListComponent implements OnInit {
  config: Config;
  form: FormGroup;
  workOrderList: WorkOrder[];
  filterNumber: number;
  workOrderTypeList = [WorkOrderType.CORRECTIVE, WorkOrderType.EMERGENCY];
  mainInfo: MainInfo;
  priorityItemList = Object.keys(Priority);
  selectedSidebarFilter: HistorySearchParameter | null;
  tooltip?: ColumnTooltip;
  userType = UserType;
  person: Person;
  listViewType: LIST_VIEW_TYPE = LIST_VIEW_TYPE.TABLE;
  @ViewChild("kanbanBoard") kanbanBoard: any;

  ArchiveButtonList = [
    {
      label: "WORK_ORDERS.FILTER.HIDE_ARCHIVED",
      action: (): void => this.isArchiveFilter(false),
    },
    {
      label: "WORK_ORDERS.FILTER.JUST_ARCHIVED",
      action: (): void => this.isArchiveFilter(true),
    },
    {
      label: "WORK_ORDERS.FILTER.SHOW_ALL",
      action: (): void => this.isArchiveFilter("showAll"),
    },
  ];
  activeButton: number = 0;
  filterSearch: FilterSearchModel;

  permission = UserPermissions;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private workOrderApi: WorkOrderApi,
    private dialogService: ProsetDialogService,
    private sidebarService: SidebarService,
    private loaderService: LoaderService,
    private shareService: ShareService,
    private toastService: ToastService,
  ) {}

  calendarEvents: CalendarEvent[] = [];

  initCalendar() {
    this.calendarEvents = this.workOrderList.map((value) => {
      const event: CalendarEvent = {
        title: value.name,
        start: value.startDate!,
        end: value.endDate!,
        id: value?.id?.toString(),
        extendedProps: {
          background: assignPriorityColorToEvent(value.status),
          link: `/maintenance/work-order/view/` + value.id,
          description: value?.description,
          actions: [],
          end: value?.endDate,
        },
      };

      if (value.isRejected)
        event.extendedProps?.actions?.push({
          icon: "isax isax-dislike disaccept-color",
        });

      if (value.type == WorkOrderType.PREVENTIVE)
        event.extendedProps?.actions?.push({
          icon: "isax isax-refresh-circle third-color",
        });

      return event;
    });
  }

  onCalendarEventClick(info: any) {
    const eventObj = info.event;
    const link = eventObj.extendedProps?.link;
    if (link) {
      window.open(link, "_blank");
    }
  }

  kanbanColumns: KanbanColumnType[] = [
    {
      name: "KANBAN_BOARD_COLUMN.OPEN",
      status: WorkOrderStatus.OPEN,
      color: assignPriorityColorToEvent(WorkOrderStatus.OPEN),
    },
    {
      name: "KANBAN_BOARD_COLUMN.UNDER_EXECUTION",
      status: WorkOrderStatus.UNDER_EXECUTION,
      color: assignPriorityColorToEvent(WorkOrderStatus.UNDER_EXECUTION),
    },
    {
      name: "KANBAN_BOARD_COLUMN.WORK_LOG",
      status: WorkOrderStatus.WORK_LOG,
      color: assignPriorityColorToEvent(WorkOrderStatus.WORK_LOG),
    },
    {
      name: "KANBAN_BOARD_COLUMN.FINISHED",
      status: WorkOrderStatus.FINISHED,
      color: assignPriorityColorToEvent(WorkOrderStatus.FINISHED),
    },
  ];

  workOrderTasks: TaskType[] = [];
  workOrderTasksActions: KanbanCardActionType[] = [
    {
      title: "KANBAN_CARD_MENU.DELETE",
      status: WorkOrderStatus.OPEN,
      action: (task) => {
        this.deleteWorkOrderById(task);
      },
    },
    {
      title: "KANBAN_CARD_MENU.EDIT",
      status: WorkOrderStatus.OPEN,
      action: (task) => {
        this.updateRowFromKanban(task);
      },
    },
    {
      title: "KANBAN_CARD_MENU.PRINT",
      action(task) {},
    },
  ];

  initKanban() {
    this.workOrderTasks = this.workOrderList.map((m: WorkOrder) => {
      return {
        link: `/maintenance/maintenance/work-order/view/` + m.id,
        assignee: m?.executionManager,
        author: m?.executionManager,
        title: m?.name,
        priority: m?.priority,
        start_date: m.startDate,
        id: m.id?.toString(),
        code: m.code,
        end_date: m.endDate,
        status: m.status,
        isRejected: m.isRejected,
        orgEntity: m,
        color: "",
        labels: [
          {
            title: "WORK_ORDERS.WORK_ORDER_TYPE." + m.type,
            color: "#E30000",
          },
          {
            title: m.asset?.name,
            color: "#009878",
          },
        ],
      } as TaskType;
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.config = this.initWorkOrderTable();
    this.filterSearch = { isArchive: false };
    this.isArchiveFilter(false);
    this.form
      .get("toCode")
      ?.setValidators([this.toCodeValidator(this.form.get("fromCode")!)]);
    this.onSearchWorkOrder();
    this.onFromCodeChange();
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

  onFromCodeChange() {
    this.form.get("fromCode")?.valueChanges.subscribe(() => {
      this.form.get("toCode")?.updateValueAndValidity();
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      workOrderType: [null],
      assetId: [null],
      fromCode: [null],
      toCode: [null],
      fromDate: [null],
      toDate: [null],
      priority: [null],
      repairPersonnelInfo: [null],
      executionManagerInfo: [null],
      isArchive: [null],
    });
  }

  assetChange(value: any) {
    if (value as Asset[]) {
      this.mainInfo = { ...this.mainInfo, asset: value as any };
      let assetList = value.map((asset: Asset) => asset.id);
      this.form.controls["assetId"].patchValue(assetList);
    }
  }

  onExecutionManagerChange(value: any) {
    if (value) {
      let personList = value.map((person: Person) => person?.id);
      this.form.controls["executionManagerInfo"].patchValue(personList);
    }
  }

  onSearchWorkOrder() {
    this.loaderService.setLoading(true);
    const {
      workOrderType,
      assetId,
      fromCode,
      toCode,
      fromDate,
      toDate,
      priority,
      executionManagerInfo,
      isArchive,
      createdBy,
      updatedBy,
      createdFrom,
      createdTo,
      updatedFrom,
      updatedTo,
    } = this.filterSearch;
    this.workOrderApi
      .searchWorkOrder(
        workOrderType,
        assetId,
        fromCode,
        toCode,
        fromDate,
        toDate,
        priority,
        executionManagerInfo,
        isArchive,
        createdBy,
        updatedBy,
        createdFrom,
        createdTo,
        updatedFrom,
        updatedTo,
      )
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response: WorkOrder[]) => {
        this.workOrderList = response;
        this.initKanban();
        this.initCalendar();
      });
  }

  updateRowFromKanban(row: any) {
    if (row.status === WorkOrderStatus.OPEN) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([
          "maintenance/maintenance/work-order/",
          FORM_MODE.UPDATE,
          row.id,
        ]),
      );
      window.open(url, "_blank");
    } else {
      this.dialogService.showInfo({
        title: "GENERAL.ERROR_TITLE",
        contentMessage: "WORK_ORDERS.MESSAGES.WORK_ORDER_NOT_UPDATABLE",
      });
    }
  }

  updateRow(row: WorkOrder) {
    if (row.status === WorkOrderStatus.OPEN) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([
          "maintenance/maintenance/work-order/",
          FORM_MODE.UPDATE,
          row.id,
        ]),
      );
      this.router.navigateByUrl(url);
    } else {
      this.dialogService.showInfo({
        title: "GENERAL.ERROR_TITLE",
        contentMessage: "WORK_ORDERS.MESSAGES.WORK_ORDER_NOT_UPDATABLE",
      });
    }
  }

  onDoubleClick(row: WorkOrder) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        "maintenance/maintenance/work-order/",
        FORM_MODE.VIEW,
        row.id,
      ]),
    );
    this.router.navigateByUrl(url);
  }

  deleteWorkOrderById(row: any): void {
    if (row.status === WorkOrderStatus.OPEN) {
      this.dialogService
        .showConfirm({
          size: "l",
          image: "assets/img/modal_icon.png",
          contentMessage: "MESSAGES.DELETE_CONFIRM",
        })
        .afterClosed()
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe((response) => {
          if (response && row.id) {
            this.workOrderApi.deleteWorkOrderById(row.id).subscribe({
              next: (): void => {
                this.toastService.success(
                  "WORK_ORDERS.MESSAGES.ACTION_MESSAGE_SUCCESS",
                );
                this.onSearchWorkOrder();
              },
              error: (): void => {
                this.toastService.error(
                  "WORK_ORDERS.MESSAGES.ACTION_MESSAGE_FAIL",
                );
              },
            });
          }
        });
    } else {
      this.dialogService.showInfo({
        title: "GENERAL.ERROR_TITLE",
        contentMessage: "WORK_ORDERS.MESSAGES.WORK_ORDER_NOT_DELETABLE",
      });
    }
  }

  onFilterForm(event: any) {
    if (event.isReset) {
      this.resetForm();
    }
    this.selectedSidebarFilter = event.value;
    let formValue = flattenObject(this.form.value);
    if (formValue.isArchive === "showAll") {
      this.form.value.isArchive = null;
    }
    if (formValue.isArchive === false) {
      this.filterNumber =
        this.sidebarService.updateFilterList(formValue).length - 1;
    } else {
      this.filterNumber =
        this.sidebarService.updateFilterList(formValue).length;
    }

    this.filterSearch = { ...this.form.value, ...event.value };
    this.onSearchWorkOrder();
  }

  isArchiveFilter(isArchive: any) {
    this.form.controls["isArchive"].patchValue(isArchive);
  }

  resetForm() {
    this.form.reset();
    this.filterNumber = 0;
    this.activeButton = 0;
    this.selectedSidebarFilter = null;
    this.mainInfo = {};
    this.isArchiveFilter(false);
  }

  onFilter(): void {
    this.sidebarService.set_sidenavMode(true);
  }

  initWorkOrderTable(): Config {
    return {
      id: "WORK_ORDERS",
      limitPerPage: 0,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      list: [
        {
          type: FieldType.text,
          id: "WORK_ORDERS_NUMBER",
          label: "WORK_ORDERS.TABLE.WORK_ORDERS_NUMBER",
          field: "code",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "WORK_ORDERS_DATE",
          label: "WORK_ORDERS.TABLE.WORK_ORDERS_DATE",
          field: "date",
          minWidth: 100,
          width: 150,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "REQUEST_NUMBER",
          label: "WORK_ORDERS.TABLE.REQUEST_NUMBER",
          field: "workRequest.code",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REQUEST_DATE",
          label: "WORK_ORDERS.TABLE.REQUEST_DATE",
          field: "workRequest.issueDate",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "REQUESTER_NAME",
          label: "WORK_ORDERS.TABLE.REQUESTER_NAME",
          field: "workRequest.applicant.name",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "TITLE",
          label: "WORK_ORDERS.TABLE.TITLE",
          field: "name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ASSET",
          label: "WORK_ORDERS.TABLE.ASSET",
          field: "asset.name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "NUMBER_PLATE",
          label: "WORK_ORDERS.TABLE.NUMBER_PLATE",
          field: "asset.code",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "EMPLACEMENT_LOCATION",
          label: "WORK_ORDERS.TABLE.EMPLACEMENT_LOCATION",
          field: "asset.emplacementLocationName",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ASSET_STATUS",
          label: "WORK_ORDERS.TABLE.ASSET_STATUS",
          field: "asset.status",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("ASSET.FORM.STATUS." + value)
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "ORDER_TYPE",
          label: "WORK_ORDERS.TABLE.ORDER_TYPE",
          field: "type",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant(
                  "WORK_ORDERS.WORK_ORDER_TYPE." + value,
                )
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
          id: "PRIORITY",
          label: "WORK_ORDERS.TABLE.PRIORITY",
          field: "priority",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("PRIORITY." + value)
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "EXECUTION_RESPONSIBLE",
          label: "WORK_ORDERS.TABLE.EXECUTION_RESPONSIBLE",
          field: "executionManager.name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "EXECUTION_RESPONSIBLE_CODE",
          label: "WORK_ORDERS.TABLE.EXECUTION_RESPONSIBLE_CODE",
          field: "executionManager.code",
          minWidth: 150,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ASSET_STATUS_WHILE_REPAIRING",
          label: "WORK_ORDERS.TABLE.ASSET_STATUS_WHILE_REPAIRING",
          field: "assetStatusDuringRepair",
          minWidth: 100,
          width: 150,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant(
                  "WORK_ORDERS.ASSET_CONDITION." + value,
                )
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "START_DATE",
          label: "WORK_ORDERS.TABLE.START_DATE",
          field: "startDate",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "END_DATE",
          label: "WORK_ORDERS.TABLE.END_DATE",
          field: "endDate",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
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
          label: "WORK_ORDERS.TABLE.STATUS",
          field: "status",
          minWidth: 100,
          width: 150,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("WORK_ORDERS.STATUS." + value)
              : "-";
          },
        },
      ],
      actions: [
        {
          id: "EDIT",
          icon: "isax isax-edit-2",
          tooltip: "DATATABLE.EDIT",
          permission: [this.permission.WORK_ORDER_UPDATE],
          label: "DATATABLE.EDIT",
          action: (row: WorkOrder): void => this.updateRow(row),
        },
        {
          id: "delete",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.WORK_ORDER_DELETE],
          action: (row: WorkOrder): void => this.deleteWorkOrderById(row),
        },
      ],
    };
  }

  get LIST_VIEW_TYPE() {
    return LIST_VIEW_TYPE;
  }

  goNewWorkOrder() {
    this.router.navigateByUrl("/maintenance/maintenance/work-order/create");
  }
}
