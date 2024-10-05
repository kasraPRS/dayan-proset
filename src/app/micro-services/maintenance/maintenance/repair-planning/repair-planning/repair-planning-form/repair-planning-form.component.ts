import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgSelectConfig } from "@ng-select/ng-select";
import { TranslateService } from "@ngx-translate/core";
import {
  Asset,
  AssetInfo,
  AssetStatusDuringRepair,
  CheckList,
  CheckListApi,
  IterationType,
  Measurement,
  MeasurementApi,
  PersonInfo,
  Priority,
  RepairPlanning,
  RepairPlanningApi,
  RepairPlanningStatus,
  RepairPlanningWorkOrder,
  ScheduleType,
  UserType,
} from "@proset/maintenance-client";
import * as _ from "lodash";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE } from "src/app/share/enums/enums";
import { Config, FieldType } from "../../../../../../share/datatable/type";
import { ToastService } from "../../../../../../share/service/toast.service";
import { LoaderService } from "../../../../../../share/service/loader.service";
import { FormSharedService } from "../../../../../../share/service/form-share.service";
import { ProsetDialogService } from "../../../../../../share/service/proset-dialog.service";
import { ChecklistModalComponent } from "../../../../../../share/modal-component/checklist-modal/checklist-modal.component";

@Component({
  selector: "proset-repair-planning-form",
  templateUrl: "./repair-planning-form.component.html",
  styleUrl: "./repair-planning-form.component.less",
})
export class RepairPlanningFormComponent implements OnInit, OnChanges {
  @Input() viewType: FORM_MODE;
  @Input() repairPlanningDTO: RepairPlanning;
  @Output() getRepairPlanningEvent = new EventEmitter<number>();
  @Input() workOrders: RepairPlanningWorkOrder[] = [];
  readonly panelOpenState = signal(false);
  permission = UserPermissions;
  form: FormGroup;
  asset: AssetInfo;
  viewModeList: string[] = [];
  status = RepairPlanningStatus;
  viewMode: boolean = false;
  multiple: boolean = true;
  disabled: boolean = true;
  priority: string[] = [];
  maintenanceAssetCondition: string[] = [];
  scheduleTypes: string[] = [];
  planningType: string[] = [];
  executionResponsibleCode: any = "";
  isCodeInvalid: boolean = false;
  minDateController: any = "";
  iterationType: string = "";
  measurement: Measurement[] = [];
  userType = UserType;
  scheduleHasValue: boolean = false;
  selectedSchedule: ScheduleType.TIME_BASE;

  get schedule(): FormGroup {
    return this.form.get("schedule") as FormGroup;
  }

  get checkLists(): FormArray {
    return this.form.get("checkLists") as FormArray;
  }

  checkList: CheckList[] = [];
  selectedCheckLists: CheckList[] = [];
  remainCheckLists: CheckList[] = []; //  ng-select item same time with api
  checkListDataTableConfig: Config;
  checkListDto: CheckList;
  constructor(
    private _toastService: ToastService,
    private _loaderService: LoaderService,
    private _ngSelectConfig: NgSelectConfig,
    private _translateService: TranslateService,
    private _fb: FormBuilder,
    private _repairPlanning: RepairPlanningApi,
    private _measurementApi: MeasurementApi,
    private formShareService: FormSharedService,
    private _checkListApi: CheckListApi,
    private dialogService: ProsetDialogService,
    private _router: Router,
  ) {
    this._ngSelectConfig.notFoundText = this._translateService.instant(
      "GENERAL.NOT_FOUND_MESSAGE",
    );
    this._ngSelectConfig.notFoundText =
      this._translateService.instant("GENERAL.LOADING");
  }

  ngOnInit() {
    this.initForm();
    this.onSelectScheduleTypes(ScheduleType.TIME_BASE);
    this.adjustPriority();
    this.adjustAssetCondition();
    this.adjustScheduleType();
    this.adjustPlanningType();
    this.startDateValidation();
    this.setRepairPlanning();

    this.checkScheduleTypeChange();
    this.checkDisableScheduleType();
    this.checkListDataTableConfig = this.initCheckListTable();
    this.getAllCheckList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.viewType === FORM_MODE.VIEW) {
      this.visibilityForm(true);
      this.onIterationTypeCheck(
        this.repairPlanningDTO.schedule?.iterationType!,
      );
    }
  }

  initForm() {
    this.form = this._fb.group({
      code: [null, Validators.required],
      checkLists: [null, Validators.required],
      date: [new Date(), Validators.required],
      name: [null, Validators.required],
      asset: [null, Validators.required],
      priority: [null, Validators.required],
      executionManager: [null, Validators.required],
      assetStatusDuringRepair: [null, Validators.required],
      description: [null],
      schedule: this._fb.group({
        scheduleType: ["TIME_BASE", Validators.required],
        iterationType: [null], // daily, weekly , ...
        schedulerType: [null], // usageBaseIterationMeasurement
        iteratorReminder: [null], // usageBaseIterator
        iterator: [null, Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        schedulerStartPointInDay: [null, Validators.required],
        description: [null],
      }),
    });
    this.viewModeList = Object.keys(this.form.controls);
  }

  checkDisableScheduleType() {
    const {
      iterationType,
      iterator,
      startDate,
      endDate,
      schedulerStartPointInDay,
      description,
      schedulerType,
      iteratorReminder,
    } = this.schedule.getRawValue();
    this.scheduleHasValue = Boolean(
      iterationType ||
        iterator ||
        startDate ||
        endDate ||
        schedulerStartPointInDay ||
        description ||
        schedulerType ||
        iteratorReminder,
    );
    if (!this.scheduleHasValue) {
      this.selectedSchedule = this.schedule.controls["scheduleType"].value;
    }
  }

  checkScheduleTypeChange() {
    this.schedule.valueChanges.subscribe((change) => {
      this.checkDisableScheduleType();
    });
  }

  getAllMeasurement() {
    this._loaderService.setLoading(true);
    this._measurementApi
      .getAllMeasurement()
      .pipe(finalize(() => this._loaderService.setLoading(false)))
      .subscribe((measurement) => {
        if (measurement) {
          this.measurement = measurement;
        }
      });
  }

  setRepairPlanning() {
    if (this.repairPlanningDTO.id) {
      this.form.patchValue(this.repairPlanningDTO);
      this.selectedCheckLists = this.repairPlanningDTO?.checkLists!;
      if (this.schedule.controls["scheduleType"].value === "USAGE_BASE") {
        this.schedule.controls["iterationType"].patchValue(null);
        this.schedule.controls["iterationType"].clearValidators();
        this.schedule.controls["iteratorReminder"].setValidators([
          Validators.required,
        ]);
        this.schedule.controls["schedulerType"].setValidators([
          Validators.required,
        ]);
      }

      this.getAllMeasurement();
      this.schedule.controls["schedulerType"].patchValue(
        this.repairPlanningDTO.schedule?.schedulerType?.name,
      );
      this.visibilityAsset(this.repairPlanningDTO?.asset);
    } else {
      this.form.controls["code"].patchValue(this.repairPlanningDTO.code);
    }
  }

  visibilityForm(view: boolean) {
    this.viewMode = view;
    this.formShareService.visibilityAction(this.form, this.viewModeList, view);
    this.form.updateValueAndValidity();
  }

  formStyle(key: string, form: FormGroup) {
    return this.formShareService.formStyle(key, form);
  }

  assetChange(asset: AssetInfo | AssetInfo[]) {
    this.visibilityAsset(asset);
  }

  visibilityAsset(asset: any) {
    if (asset) {
      this.form.get("checkLists")?.enable();
      this.formShareService.setValidator("checkLists", this.form);
      this.getAllCheckList();
    } else {
      this.form.get("checkLists")?.disable();
      this.formShareService.clearValidator("checkLists", this.form);
    }
    this.asset = asset!;
    this.form.controls["asset"].patchValue(this.asset);
  }

  onRowSelect(event: any): void {
    this.checkListDto = event;
  }

  setAsset(asset: any) {
    this.asset = asset! as Asset;
    this.form.controls["asset"].patchValue(this.asset!);
  }

  getAllCheckList() {
    this._loaderService.setLoading(true);
    this._checkListApi
      .getAllCheckList()
      .pipe(finalize(() => this._loaderService.setLoading(false)))
      .subscribe((checkLists) => {
        if (checkLists) {
          this.checkList = checkLists;
          this.remainCheckLists = checkLists;
          this.remainCheckLists = _.differenceBy(
            this.checkList,
            this.selectedCheckLists,
            "uuid",
          );
        }
      });
  }

  adjustPriority() {
    this.priority = Object.keys(Priority);
    this.priority = [
      ..._.filter(
        this.priority,
        (priority) =>
          priority === Priority.CRITICAL ||
          priority === Priority.HIGH ||
          priority === Priority.MIDDLE ||
          priority === Priority.LOW,
      ),
    ];
  }

  adjustAssetCondition() {
    this.maintenanceAssetCondition = Object.keys(AssetStatusDuringRepair);
    this.maintenanceAssetCondition = [
      ..._.filter(
        this.maintenanceAssetCondition,
        (maintenanceAssetCondition) =>
          maintenanceAssetCondition === AssetStatusDuringRepair.STOPPED ||
          maintenanceAssetCondition === AssetStatusDuringRepair.IS_WORKING,
      ),
    ];
  }

  adjustScheduleType() {
    this.scheduleTypes = Object.keys(ScheduleType);
    this.scheduleTypes = [
      ..._.filter(
        this.scheduleTypes,
        (scheduleTypes) =>
          scheduleTypes === ScheduleType.TIME_BASE ||
          scheduleTypes === ScheduleType.USAGE_BASE,
      ),
    ];
  }

  adjustPlanningType() {
    this.planningType = Object.keys(IterationType);
    this.planningType = [
      ..._.filter(
        this.planningType,
        (planningType) =>
          planningType === IterationType.DAILY ||
          planningType === IterationType.WEEKLY ||
          planningType === IterationType.MONTHLY ||
          planningType === IterationType.YEARLY,
      ),
    ];
  }

  onIterationTypeCheck(each: any) {
    switch (each) {
      case IterationType.DAILY:
        return (this.iterationType = "DAY");
      case IterationType.WEEKLY:
        return (this.iterationType = "WEEK");
      case IterationType.MONTHLY:
        return (this.iterationType = "MONTH");
      case IterationType.YEARLY:
        return (this.iterationType = "YEAR");
      default:
        return (this.iterationType = "");
    }
  }

  executionResponsibleChange(e: PersonInfo) {
    if (e !== undefined) {
      this.executionResponsibleCode = e.code;
      this.form.controls["executionManager"].patchValue(e);
    }
  }

  startDateValidation() {
    const startDate = this.form.controls["date"]?.value;
    this.minDateController = startDate;
    this.form.controls["date"]?.valueChanges.subscribe((change) => {
      this.minDateController = change;
      if (change === undefined) {
        this.schedule.get("startDate")?.disable();
        this.schedule.get("startDate")?.patchValue(null);
        this.schedule.get("endDate")?.disable();
        this.schedule.get("endDate")?.patchValue(null);
        this.form.setErrors({ incorrect: true });
      } else {
        this.schedule.get("startDate")?.enable();
        this.schedule.get("endDate")?.enable();
        this.form.setErrors({ incorrect: false });
      }
    });
  }

  flattenValue(obj: RepairPlanning) {
    const flattened: any = {
      ...obj,
      checkLists: this.selectedCheckLists,
    };
    return flattened;
  }

  createAction() {
    if (this.form.valid) {
      let formValue: RepairPlanning = this.flattenValue(
        this.form.getRawValue(),
      );

      this._loaderService.setLoading(true);
      this._repairPlanning
        .createRepairPlanning(formValue)
        .pipe(finalize(() => this._loaderService.setLoading(false)))
        .subscribe(
          (response) => {
            this._toastService.success(
              "REPAIR_PLANNING.MESSAGES.MESSAGE_SUCCESS",
            );
            this.repairPlanningDTO = response;
            this.getRepairPlanningEvent.emit(response.id);
            this.visibilityForm(true);
          },
          (error) => {
            this._loaderService.setLoading(false);
            this._toastService.error("REPAIR_PLANNING.MESSAGES.MESSAGE_FAIL");
          },
        );
    } else {
      return;
    }
  }

  checkSchedulerType() {
    if (
      this.schedule.controls["schedulerType"].value ===
      this.repairPlanningDTO.schedule?.schedulerType?.name
    ) {
      this.schedule.controls["schedulerType"].patchValue(
        this.repairPlanningDTO.schedule?.schedulerType,
      );
    } else {
      return;
    }
  }

  updateRepairPlanningById() {
    if (this.form.valid) {
      this.checkSchedulerType();
      let formValue: RepairPlanning = this.flattenValue(
        this.form.getRawValue(),
      );
      formValue.status = this.repairPlanningDTO.status;
      formValue!.isArchive = this.repairPlanningDTO?.isArchive;
      this._loaderService.setLoading(true);
      this._repairPlanning
        .updateRepairPlanningById(Number(this.repairPlanningDTO.id), formValue)
        .pipe(finalize(() => this._loaderService.setLoading(false)))
        .subscribe(
          (response) => {
            this._toastService.success(
              "REPAIR_PLANNING.MESSAGES.MESSAGE_SUCCESS",
            );
            this.getRepairPlanningEvent.emit(response.id);
            this.visibilityForm(true);
          },
          (error) => {
            this._loaderService.setLoading(false);
            this._toastService.error("REPAIR_PLANNING.MESSAGES.MESSAGE_FAIL");
          },
        );
    } else {
      return;
    }
  }

  changeScheduleType(value: ScheduleType | any) {
    this.schedule.controls["scheduleType"].patchValue(this.selectedSchedule);
    if (this.repairPlanningDTO.schedule?.scheduleType != value) {
      this.schedule.controls["scheduleType"].patchValue(value);
    } else {
      this.schedule.controls["scheduleType"].patchValue(this.selectedSchedule);
    }
    if (this.scheduleHasValue) {
      this.dialogService
        .showConfirm({
          size: "l",
          image: "assets/img/modal_icon.png",
          contentMessage: "REPAIR_PLANNING.MESSAGES.REMOVE_SCHEDULE",
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.onSelectScheduleTypes(value);
          } else {
            if (this.repairPlanningDTO.schedule?.scheduleType) {
              this.schedule.controls["scheduleType"].patchValue(
                this.repairPlanningDTO.schedule?.scheduleType,
              );
            } else {
              this.schedule.controls["scheduleType"].patchValue(
                this.selectedSchedule,
              );
            }
          }
        });
    } else {
      this.onSelectScheduleTypes(value);
      return;
    }
  }

  onSelectScheduleTypes(value: ScheduleType | any) {
    switch (value) {
      case ScheduleType.TIME_BASE:
        this.schedule.reset();
        this.schedule.controls["iteratorReminder"].clearValidators();
        this.schedule.controls["schedulerType"].clearValidators();
        this.schedule.controls["iteratorReminder"].patchValue(null);
        this.schedule.controls["schedulerType"].patchValue(null);
        this.schedule.controls["iterationType"].setValidators([
          Validators.required,
        ]);
        this.schedule.controls["scheduleType"].patchValue(value);
        break;
      case ScheduleType.USAGE_BASE:
        this.schedule.reset();
        this.measurement = [];
        this.getAllMeasurement();
        this.schedule.controls["iterationType"].clearValidators();
        this.schedule.controls["iterationType"].patchValue(null);
        this.schedule.controls["iteratorReminder"].setValidators([
          Validators.required,
        ]);
        this.schedule.controls["schedulerType"].setValidators([
          Validators.required,
        ]);
        this.schedule.controls["scheduleType"].patchValue(value);
        break;
    }
    this.schedule.updateValueAndValidity();
  }

  initCheckListTable(): Config {
    return {
      id: "CHECKLIST_TABLE",
      limitPerPage: 0,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      list: [
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_TITLE",
          label: "REPAIR_PLANNING.TABLE.CHECKLIST.CODE",
          field: "code",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPAIR_PLANNING_NUMBER",
          label: "REPAIR_PLANNING.TABLE.CHECKLIST.NAME",
          field: "name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
      ],
      actions: [
        {
          id: "delete",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          hidden: this.viewMode,
          permission: [this.permission.CHECKLIST_DELETE],
          action: (row: CheckList): void => this.deleteCheckList(row),
        },
      ],
    };
  }

  deleteCheckList(row: CheckList) {
    this.dialogService
      .showConfirm({
        size: "l",
        image: "assets/img/modal_icon.png",
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((afterClose) => {
        if (afterClose) {
          this.selectedCheckLists = _.remove(
            this.selectedCheckLists,
            (item) => item !== row,
          );
          this.checkLists.patchValue(this.selectedCheckLists);
        }
      });
  }

  openActivity() {
    this.dialogService
      .showWithFormComponent(ChecklistModalComponent, {
        title: "WORK_CENTER.TITLE",
        data: _.differenceBy(this.checkList, this.selectedCheckLists!, "uuid"),
      })
      .afterClosed()
      .subscribe((result) => {
        this.selectedCheckLists = this.selectedCheckLists.concat(result);
        this.selectedCheckLists.filter(
          (filter) => filter !== undefined && filter !== null,
        ),
          this.checkLists.patchValue(this.selectedCheckLists);
      });
  }

  goToList() {
    this.dialogService
      .showConfirm({
        title: "ASSET.MESSAGES.BACK_TO_LIST_TITLE",
        contentMessage: "ASSET.MESSAGES.BACK_TO_LIST",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this._router.navigate([
            "maintenance/maintenance/repair-planning/list",
          ]);
        }
      });
  }
}
