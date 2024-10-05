import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgSelectComponent } from "@ng-select/ng-select";
import {
  Asset,
  AssetApi,
  AssetInfo,
  AssetStatusDuringRepair,
  FailureModeApi,
  Person,
  Priority,
  UserType,
  WorkOrder,
  WorkOrderApi,
  WorkOrderStatus,
  WorkOrderType,
  WorkRequest,
  WorkRequestApi,
} from "@proset/maintenance-client";
import { FailureMode } from "@proset/maintenance-client/model/failureMode";
import { WorkRequestResponse } from "@proset/maintenance-client/model/workRequestResponse";
import * as moment from "jalali-moment";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { FORM_MODE } from "src/app/share/enums/enums";
import {
  endDateLessThanStartDate,
  isAfterDate,
} from "src/app/share/helper/date";
import { LoaderService } from "src/app/share/service/loader.service";
import { ToastService } from "src/app/share/service/toast.service";
import { ProsetDialogService } from "../../../../../../share/service/proset-dialog.service";
import { FormSharedService } from "../../../../../../share/service/form-share.service";

@Component({
  selector: "proset-work-order",
  templateUrl: "./work-order.component.html",
  styleUrl: "./work-order.component.less",
})
export class WorkOrderComponent implements OnInit, AfterViewInit {
  @Input() workOrderDto: WorkOrder;
  @Input() viewType: FORM_MODE;
  @Output() getWorkOrderEvent = new EventEmitter<number>();
  @ViewChild("selectFailureMode", { static: false })
  selectFailureMode: NgSelectComponent;
  @ViewChild("selectRequest", { static: false })
  selectRequest: NgSelectComponent;
  form: FormGroup;
  isCodeInvalid: boolean = false;
  status = WorkOrderStatus;
  viewMode: boolean = false;
  viewModeList: string[] = [];
  asset: AssetInfo;
  workOrderType = WorkOrderType.PREVENTIVE;
  workOrderTypeList = [WorkOrderType.CORRECTIVE, WorkOrderType.EMERGENCY];
  priorityItemList = Object.keys(Priority).reverse();
  requestDtoList: WorkRequestResponse[];
  maxWorkOrderDate: Date = new Date();
  requestDate = new FormControl({ value: null, disabled: true });
  requestCode = new FormControl();
  assetStatusDuringRepair = Object.keys(AssetStatusDuringRepair);
  userType = UserType;
  failureMode: FailureMode[] = [];
  person: Person;
  permission = UserPermissions;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private workOrderApi: WorkOrderApi,
    private assetApi: AssetApi,
    private router: Router,
    private requestApi: WorkRequestApi,
    private _dialogService: ProsetDialogService,
    private _failureApi: FailureModeApi,
    private formShareService: FormSharedService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getRequest();
    this.setWorkOrder();
    if (this.viewType === FORM_MODE.VIEW) {
      this.visibilityAction(true);
    }
    if (
      this.viewType === FORM_MODE.UPDATE &&
      this.workOrderDto.type === WorkOrderType.PREVENTIVE
    ) {
      this.visibilityAction(false);
    }
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  initForm() {
    this.form = this.formBuilder.group(
      {
        code: [null, Validators.required],
        workRequest: [null],
        failureModeList: [
          { value: null, disabled: true },
          [Validators.required],
        ],
        failureDetectionMethod: [null, Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        type: [null, Validators.required],
        date: [new Date(), Validators.required],
        name: [null, Validators.required],
        asset: [null, Validators.required],
        priority: [null, Validators.required],
        executionManager: [null, Validators.required],
        assetStatusDuringRepair: [null, Validators.required],
        description: [null],
      },
      { validator: endDateLessThanStartDate("startDate", "endDate") },
    );
    this.viewModeList = Object.keys(this.form.controls);
  }

  setWorkOrder() {
    if (
      this.workOrderDto.asset?.id &&
      this.workOrderDto.type === WorkOrderType.PREVENTIVE
    ) {
      this.viewModeList = [
        "startDate",
        "endDate",
        "executionManager",
        "priority",
      ];
    }
    if (this.workOrderDto?.asset?.id) {
      this.form.patchValue(this.workOrderDto);
      this.onPersonChange(this.workOrderDto.executionManager as Person);
      if (!this.workOrderDto.failureModeList) {
        this.form.controls["failureModeList"].patchValue(
          this.workOrderDto.workRequest?.failureModeList!,
        );
      }
      if (this.workOrderDto.workRequest?.id) {
        this.setRequest(this.workOrderDto.workRequest!);
        this.getAssetById(this.workOrderDto?.workRequest?.asset?.id!);
        this.getAllFailureModeByAsset(
          this.workOrderDto?.workRequest?.asset?.id!,
        );
      } else {
        this.getAllFailureModeByAsset(this.workOrderDto?.asset?.id!);
        this.visibilityAsset(this.workOrderDto?.asset);
      }
    } else {
      this.form.controls["code"].patchValue(this.workOrderDto.code);
    }
  }

  getAssetById(id: number) {
    this.assetApi
      .getAssetById(id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: any) => {
          this.visibilityAsset(response!);
        },
      });
  }

  getRequest() {
    this.requestApi
      .getAllAvailableWorkRequestForWorkOrder()
      .subscribe((response: WorkRequestResponse[]) => {
        this.requestDtoList = response;
      });
  }

  onRequestChange(request: WorkRequestResponse) {
    if (request !== undefined) {
      this.setRequest(request);
      this.assetChange(request?.asset!);
      if (isAfterDate(request?.issueDate!, this.form.controls["date"]?.value)) {
        this.form.controls["date"].patchValue(null);
      }
      this.form.controls["failureModeList"].patchValue(request.failureModeList);
    } else {
      this.setRequest(request!);
      this.workOrderDto.workRequest = {};
      this.failureMode = [];
      this.form.controls["failureModeList"].patchValue(null);
      this.form.controls["priority"].patchValue(null);
    }
  }

  setRequest(request: WorkRequestResponse) {
    if (request !== undefined) {
      this.requestDate.patchValue(request?.issueDate! as any);
      this.workOrderDto.workRequest = request;
      this.requestCode.patchValue(request?.code!);
      if (this.workOrderDto?.priority == null || undefined) {
        this.form.controls["priority"].patchValue(request?.priority);
      }
      this.form.controls["workRequest"].patchValue(request);
    } else {
      this.form.controls["asset"].patchValue(null);
      this.workOrderDto.workRequest = request;
      this.asset = request;
      this.form.controls["workRequest"].patchValue(null);
      this.requestDate.patchValue(null);
      this.form.controls["failureModeList"].patchValue(null);
    }
  }

  onSearchRequest(term: string, item: WorkRequest) {
    term = term.toLocaleLowerCase();
    return (
      item?.name!.toLocaleLowerCase().indexOf(term) > -1 ||
      item?.code!.indexOf(term) > -1
    );
  }

  onPersonChange(person: Person) {
    this.form.controls["executionManager"].patchValue(person);
    this.person = person;
  }

  getAllFailureModeByAsset(id: number) {
    this._failureApi.getAllFailureModeByAsset(id).subscribe((response) => {
      if (response) {
        this.failureMode = response;
      }
    });
  }

  onRequestSearch(item: any) {
    const searchKey = item.target.value;
    this.selectRequest.filter(searchKey);
  }

  visibilityAction(view: boolean) {
    if (this.workOrderDto.type === WorkOrderType.PREVENTIVE) {
      this.form.disable();
      this.viewMode = view;
      this.formShareService.visibilityAction(
        this.form,
        this.viewModeList,
        view,
      );
      this.form.updateValueAndValidity();
    } else {
      this.viewMode = view;
      this.formShareService.visibilityAction(
        this.form,
        this.viewModeList,
        view,
      );
      this.form.updateValueAndValidity();
    }
  }

  formStyle(key: string, form: FormGroup) {
    return this.formShareService.formStyle(key, form);
  }

  assetChange(asset: AssetInfo | AssetInfo[]) {
    this.form.controls["failureModeList"].patchValue(null);
    this.asset = asset as Asset;
    this.getAllFailureModeByAsset(Number(this.asset?.id!));
    this.visibilityAsset(asset);
  }

  visibilityAsset(asset: any) {
    if (asset) {
      this.form.get("failureModeList")?.enable();
      this.formShareService.setValidator("failureModeList", this.form);
    } else {
      this.form.get("failureModeList")?.disable();
      this.formShareService.clearValidator("failureModeList", this.form);
    }
    this.asset = asset!;
    this.form.controls["asset"].patchValue(this.asset);
  }

  visibilityRunButton() {
    let todayTime = moment();
    return moment(todayTime).isBefore(
      moment(this.form.controls["startDate"]?.value),
    );
  }

  actionModalRun() {
    this._dialogService
      .showConfirm({
        image: "assets/img/modal_icon.png",
        contentMessage: "WORK_ORDERS.MODAL.EXECUTION_TEXT",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.executeWorkOrder();
        }
      });
  }

  actionModalUnderExecution() {
    this._dialogService
      .showConfirm({
        size: "l",
        contentMessage: "WORK_ORDERS.MODAL.UNDER_EXECUTION_TEXT",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.returnFromExecuteWorkOrder();
        }
      });
  }

  flattenValue(obj: WorkOrder) {
    const flattened: any = {
      ...obj,
      workRequest: obj?.workRequest?.id ? obj.workRequest : null,
    };
    return flattened;
  }

  createAction() {
    if (this.form.invalid) {
      return;
    } else {
      let formValue: WorkOrder = this.flattenValue(this.form.getRawValue());
      this.workOrderApi
        .createWorkOrder(formValue)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: (response: WorkOrder) => {
            this.toastService.success("WORK_ORDERS.MESSAGES.MESSAGE_SUCCESS");
            this.workOrderDto = response;
            this.visibilityAction(true);
          },
          error: (error) => {
            this.loaderService.setLoading(false);
            this.toastService.success("WORK_ORDERS.MESSAGES.MESSAGE_FAIL");
          },
        });
    }
  }

  updateWorkOrderById() {
    if (this.form.invalid) {
      return;
    } else {
      this.loaderService.setLoading(true);
      let formValue: WorkOrder = this.flattenValue(this.form.getRawValue());
      formValue.status = this.workOrderDto.status;
      formValue!.isArchive = this.workOrderDto!.isArchive;
      formValue.isRejected = this.workOrderDto.isRejected;
      formValue.id = this.workOrderDto.id;
      formValue.repairPlanning = this.workOrderDto.repairPlanning;
      this.workOrderApi
        .updateWorkOrderById(this.workOrderDto.id!, formValue)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: (response) => {
            this.toastService.success("WORK_ORDERS.MESSAGES.MESSAGE_SUCCESS");
            this.workOrderDto = response;
            this.visibilityAction(true);
          },
        });
    }
  }

  executeWorkOrder() {
    this.loaderService.setLoading(true);
    this.workOrderApi
      .executeWorkOrder(this.workOrderDto?.id!)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: WorkOrder): void => {
          this.toastService.success(
            "WORK_ORDERS.MESSAGES.ACTION_MESSAGE_SUCCESS",
          );
          this.getWorkOrderEvent.emit(response.id);
          this.workOrderDto = response;
          this.visibilityAction(true);
        },
        error: (): void => {
          this.toastService.error("WORK_ORDERS.MESSAGES.ACTION_MESSAGE_FAIL");
        },
      });
  }

  returnFromExecuteWorkOrder() {
    this.loaderService.setLoading(true);
    this.workOrderApi
      .returnFromExecuteWorkOrder(this.workOrderDto?.id!)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: WorkOrder): void => {
          this.toastService.success(
            "WORK_ORDERS.MESSAGES.ACTION_MESSAGE_SUCCESS",
          );
          this.getWorkOrderEvent.emit(response.id);
          this.workOrderDto = response;
          this.visibilityAction(true);
        },
        error: (): void => {
          this.toastService.error("WORK_ORDERS.MESSAGES.ACTION_MESSAGE_FAIL");
        },
      });
  }

  goToList() {
    this._dialogService
      .showConfirm({
        title: "ASSET.MESSAGES.BACK_TO_LIST_TITLE",
        contentMessage: "ASSET.MESSAGES.BACK_TO_LIST",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.router.navigate(["maintenance/maintenance/work-order/list"]);
        }
      });
  }

  onOpenFailureMode() {
    window.open("maintenance/asset/failure-mode/list", "_blank");
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
}
