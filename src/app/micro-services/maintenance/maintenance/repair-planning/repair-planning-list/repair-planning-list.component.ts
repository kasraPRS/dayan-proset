import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import {
  Asset,
  IterationType,
  MainInfo,
  Person,
  Priority,
  RepairPlanning,
  RepairPlanningApi,
  Schedule,
  ScheduleType,
  UserType,
  WorkOrderApi,
  WorkOrderStatus,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE } from "src/app/share/enums/enums";
import { ToastService } from "src/app/share/service/toast.service";
import { ReaperPlanningFilterSearchModel } from "../model/filter-search-model";
import * as _ from "lodash";
import { RepairPlanningTransferService } from "../repair-planning-service/repair-planning-service.service";
import { repairPlanningCheckingType } from "../enums/checking-repair-planning-type.enum";
import { Config, FieldType } from "../../../../../share/datatable/type";
import { HistorySearchParameter } from "../../../../../share/model/history-search-parameter";
import { ProsetDialogService } from "../../../../../share/service/proset-dialog.service";
import { SidebarService } from "../../../../../share/sidebar-filter/sidebar-service";
import { ShareService } from "../../../../../share/service/share.service";
import { LoaderService } from "../../../../../share/service/loader.service";
import { flattenObject } from "../../../../../share/helper/flatten";

@Component({
  selector: "proset-repair-planning-list",
  templateUrl: "./repair-planning-list.component.html",
  styleUrl: "./repair-planning-list.component.less",
})
export class RepairPlanningListComponent implements OnInit {
  config: Config;
  form: FormGroup;
  selectedSidBarFilter: HistorySearchParameter | null;
  filterNumber: number;
  filterSearch: ReaperPlanningFilterSearchModel;
  repairPlanningSearchedList: RepairPlanning[] = [];
  person: Person;
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
  mainInfo: MainInfo;
  priorityItemList = Object.keys(Priority).reverse();
  userType = UserType;

  permission = UserPermissions;
  planningTypeIteration: any;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _translateService: TranslateService,
    private _repairPlanningApi: RepairPlanningApi,
    private _dialogService: ProsetDialogService,
    private _sidebarService: SidebarService,
    private _shareService: ShareService,
    private _loaderService: LoaderService,
    private _workOrderApi: WorkOrderApi,
  ) {}

  ngOnInit() {
    this.initForm();
    this.config = this.initRepairPlanningTable();
    this.filterSearch = { isArchive: false };
    this.isArchiveFilter(false);
    this.onSearchRepairPlanning();
    this.form
      .get("toCode")
      ?.setValidators([this.toCodeValidator(this.form.get("fromCode")!)]);
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

  isArchiveFilter(isArchive: any) {
    this.form.controls["isArchive"].patchValue(isArchive);
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

      this.form.controls["executionManagerId"].patchValue(personList);
    }
  }

  onFilterForm(event: any) {
    if (event.isReset) {
      this.resetForm();
    }
    this.selectedSidBarFilter = event.value;
    let formValue = flattenObject(this.form.value);
    if (formValue.isArchive) {
      this.form.value.isArchive = null;
    }
    if (formValue.isArchive === false) {
      this.filterNumber =
        this._sidebarService.updateFilterList(formValue).length - 1;
    } else {
      this.filterNumber =
        this._sidebarService.updateFilterList(formValue).length;
    }

    this.filterSearch = { ...this.form.value, ...event.value };
    this.onSearchRepairPlanning();
  }

  resetForm() {
    this.form.reset();
    this.filterNumber = 0;
    this.activeButton = 0;
    this.selectedSidBarFilter = null;
    this.mainInfo = {};
    this.isArchiveFilter(false);
  }

  initForm() {
    this.form = this._fb.group({
      assetId: [null],
      fromCode: [null],
      toCode: [null],
      fromDate: [null],
      toDate: [null],
      priority: [null],
      executionManagerId: [null],
      isArchive: [null],
    });
  }

  onSearchRepairPlanning() {
    this._loaderService.setLoading(true);
    const {
      assetId,
      fromCode,
      toCode,
      fromDate,
      toDate,
      priority,
      executionManagerId,
      isArchive,
      createdBy,
      updatedBy,
      createdFrom,
      createdTo,
      updatedFrom,
      updatedTo,
    } = this.filterSearch;
    this._repairPlanningApi
      .searchRepairPlanning(
        assetId,
        fromCode,
        toCode,
        fromDate,
        toDate,
        priority,
        executionManagerId,
        isArchive,
        createdBy,
        updatedBy,
        createdFrom,
        createdTo,
        updatedFrom,
        updatedTo,
      )
      .pipe(finalize(() => this._loaderService.setLoading(false)))
      .subscribe((response) => {
        this.repairPlanningSearchedList = response;
        this.repairPlanningSearchedList = response.map((item) => {
          return {
            ...item,
            planningTypeIteration: this.createIterationString(item.schedule!),
          };
        });
      });
  }

  createIterationString(schedule: Schedule) {
    switch (schedule?.scheduleType) {
      case ScheduleType.TIME_BASE:
        this.planningTypeIteration =
          this._translateService.instant("REPAIR_PLANNING.FORM.PLANNING.EACH") +
          " " +
          schedule.iterator +
          " " +
          this._translateService.instant(
            "REPAIR_PLANNING.TIMEBASE_ITERATION_VALUE." +
              this.onIterationTypeCheck(schedule?.iterationType!),
          );
        return this.planningTypeIteration;
      case ScheduleType.USAGE_BASE:
        return (this.planningTypeIteration =
          this._translateService.instant("REPAIR_PLANNING.FORM.PLANNING.EACH") +
          " " +
          schedule.iteratorReminder +
          " " +
          schedule?.schedulerType?.name!);
    }
  }

  onIterationTypeCheck(each: any) {
    switch (each) {
      case IterationType.DAILY:
        return "DAY";
      case IterationType.WEEKLY:
        return this._translateService.instant("WEEK");
      case IterationType.MONTHLY:
        return this._translateService.instant("MONTH");
      case IterationType.YEARLY:
        return this._translateService.instant("YEAR");
      default:
        return "";
    }
  }

  initRepairPlanningTable(): Config {
    return {
      id: "REPAIR_PLANNING",
      limitPerPage: 0,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      list: [
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_NUMBER",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_NUMBER",
          field: "code",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.date,
          id: "REPAIR_PLANNING_DATE",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_DATE",
          field: "date",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this._shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_PLANNING_TITLE",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_PLANNING_TITLE",
          field: "name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_TITLE",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_TITLE",
          field: "asset.name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ASSET",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_PLATE_NUMBER",
          field: "asset.code",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_EMPLACEMENT_LOCATION",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_EMPLACEMENT_LOCATION",
          field: "asset.emplacementLocationName",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_ASSET_STATUS",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_ASSET_STATUS",
          field: "asset.status",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value
              ? this._translateService.instant(
                  "REPAIR_PLANNING.ASSET_STATUS." + value,
                )
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_EXECUTION_MANAGER",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_EXECUTION_MANAGER",
          field: "executionManager.name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_EXECUTION_MANAGER_CODE",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_EXECUTION_MANAGER_CODE",
          field: "executionManager.code",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_ASSET_STATUS_DURING_REPAIR",
          label:
            "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_ASSET_STATUS_DURING_REPAIR",
          field: "assetStatusDuringRepair",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value
              ? this._translateService.instant(
                  "REPAIR_PLANNING.ASSET_CONDITION." + value,
                )
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_PLANNING_TYPE",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_PLANNING_TYPE",
          field: "schedule.scheduleType",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value
              ? this._translateService.instant(
                  "REPAIR_PLANNING.FORM.PLANNING.TYPE." + value,
                )
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "PLANNING_TYPE",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_SCHEDULE",
          field: "planningTypeIteration",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.date,
          id: "REPAIR_PLANNING_ITERATION_START_DATE",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_ITERATION_START_DATE",
          field: "schedule.startDate",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this._shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.date,
          id: "REPAIR_PLANNING_ITERATION_END_DATE",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_ITERATION_END_DATE",
          field: "schedule.endDate",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this._shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_CREATOR",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_CREATOR",
          field: "createdByName",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_CREATE_DATE",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_CREATE_DATE",
          field: "created",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this._shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_LAST_EDITOR",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_LAST_EDITOR",
          field: "updatedByName",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_DESCRIPTION",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_DESCRIPTION",
          field: "mainInfo.description",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_STATUS",
          label: "REPAIR_PLANNING.TABLE.REPAIR_PLANNING_STATUS",
          field: "status",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value
              ? this._translateService.instant(
                  "REPAIR_PLANNING.REPAIR_PLANNING_STATUS." + value,
                )
              : "-";
          },
        },
      ],
      actions: [
        {
          id: "EDIT",
          icon: "isax isax-edit-2",
          tooltip: "DATATABLE.EDIT",
          label: "DATATABLE.EDIT",
          permission: [this.permission.REPAIR_PLANNING_UPDATE],
          action: (row: RepairPlanning): void =>
            this.checkRepairPlanningHasConditionToDeleteOrUpdate(
              row,
              repairPlanningCheckingType.REPAIR_PLANNING_UPDATE,
            ),
        },
        {
          id: "delete",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          permission: [this.permission.WORK_ORDER_DELETE],
          action: (row: RepairPlanning): void =>
            this.checkRepairPlanningHasConditionToDeleteOrUpdate(
              row,
              repairPlanningCheckingType.REPAIR_PLANNING_DELETE,
            ),
        },
      ],
    };
  }

  updateRow(row: any) {
    const url = this._router.serializeUrl(
      this._router.createUrlTree([
        "maintenance/maintenance/repair-planning/",
        FORM_MODE.UPDATE,
        row,
      ]),
    );
    this._router.navigateByUrl(url);
  }

  deleteWorkOrderById(row: any) {
    this._dialogService
      .showConfirm({
        size: "l",
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((close) => {
        if (close) {
          this._repairPlanningApi.deleteRepairPlanningById(row).subscribe({
            next: (): void => {
              this._toastService.success(
                "WORK_ORDERS.MESSAGES.ACTION_MESSAGE_SUCCESS",
              );
              this.onSearchRepairPlanning();
            },
            error: (): void => {
              this._toastService.error(
                "WORK_ORDERS.MESSAGES.ACTION_MESSAGE_FAIL",
              );
            },
          });
        } else {
          return;
        }
      });
  }

  checkRepairPlanningHasConditionToDeleteOrUpdate(
    row: any,
    checkingType: repairPlanningCheckingType,
  ) {
    this._loaderService.setLoading(true);
    this._workOrderApi
      .getAllWOrkOrderByRepairPlanningId(row?.id!)
      .pipe(finalize(() => this._loaderService.setLoading(false)))
      .subscribe((repairPlanningWorkOrders) => {
        switch (checkingType) {
          case repairPlanningCheckingType.REPAIR_PLANNING_DELETE:
            if (
              _.some(
                repairPlanningWorkOrders,
                (items) => items.status === WorkOrderStatus.UNDER_EXECUTION,
              )
            ) {
              this._dialogService.showInfo({
                title: "GENERAL.ERROR_TITLE",
                contentMessage:
                  "REPAIR_PLANNING.MESSAGES.THIS_REPAIR_PLANNING_IS_NOT_DELETABLE",
              });
              return;
            } else {
              this.deleteWorkOrderById(row.id);
            }
            break;
          case repairPlanningCheckingType.REPAIR_PLANNING_UPDATE:
            if (_.some(repairPlanningWorkOrders, (item) => item.code)) {
              this._dialogService.showInfo({
                title: "GENERAL.ERROR_TITLE",
                contentMessage:
                  "REPAIR_PLANNING.MESSAGES.THIS_REPAIR_PLANNING_IS_NOT_EDITABLE",
              });
            } else {
              this.updateRow(row.id);
            }

            break;
        }
      });
  }

  onViewMode(row: any) {
    const url = this._router.serializeUrl(
      this._router.createUrlTree([
        "/maintenance/maintenance/repair-planning/",
        FORM_MODE.VIEW,
        row.id,
      ]),
    );
    this._router.navigateByUrl(url);
  }
}
