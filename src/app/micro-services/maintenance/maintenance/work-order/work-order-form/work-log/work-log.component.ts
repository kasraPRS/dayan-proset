import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  WorkLogApi,
  WorkLogRequest,
  WorkLogResponse,
  WorkLogStatus,
  WorkOrder,
  WorkOrderStatus,
  WorkOrderType,
} from "@proset/maintenance-client";
import { WorkOrderService } from "../../service/work-order.service";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import * as _ from "lodash";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { WorkLog } from "@proset/maintenance-client/model/workLog";
import { finalize } from "rxjs";
import * as moment from "jalali-moment";
import { ProsetDialogService } from "../../../../../../share/service/proset-dialog.service";
import { LoaderService } from "../../../../../../share/service/loader.service";
import { Moment } from "jalali-moment";

@Component({
  selector: "proset-work-log",
  templateUrl: "./work-log.component.html",
  styleUrl: "./work-log.component.less",
})
export class WorkLogComponent implements OnInit, OnDestroy {
  editor: any = DecoupledEditor;
  workLogForm: FormGroup;
  workLogResponseDto: WorkLogResponse = {};
  workLog: WorkLog = {};
  workOrder: WorkOrder;
  isFormInvalid = true;
  cost: number = 0;
  workLogRequest: WorkLogRequest = {};
  protected readonly WorkOrderType = WorkOrderType;
  @Input({ required: true }) workOrderType: WorkOrderType;

  constructor(
    private workOrderService: WorkOrderService,
    private formBuilder: FormBuilder,
    private workLogApi: WorkLogApi,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.workLogRequest.workLog = this.workLog;
    this.getWorkLogForWorkOrder();
    this.createForm();
    this.workLogResponseDto.workLog = this.workLog;
    this.workOrderService.isWorkLogActivityInvalid.subscribe((valid) => {
      this.isFormInvalid = valid;
    });
    this.workOrderService.isWorkLogPersonInvalid.subscribe((valid) => {
      this.isFormInvalid = valid;
    });
    this.workOrder = this.workOrderService.workOrder;
    if (this.workOrder) {
      this.workOrder.cost = this.workOrder.cost || 0;
    }
  }

  createForm() {
    this.workLogForm = this.formBuilder.group({
      endDateAndTime: [null, Validators.required],
      assetMinuteDownTime: [
        null,
        [Validators.required, Validators.min(0), Validators.max(59)],
      ],
      assetHourDownTime: [null, Validators.required],
      logDescription: [],
    });
  }

  initForm() {
    this.workLogForm.controls["endDateAndTime"].setValue(
      this.workLog?.endDateAndTime,
    );
    this.workLogForm.controls["assetMinuteDownTime"].setValue(
      this.workLog?.assetDowntimeInMinute,
    );
    this.workLogForm.controls["assetHourDownTime"].setValue(
      this.workLog?.assetDowntimeInHour,
    );
    this.workLogForm.controls["logDescription"].setValue(
      this.workLog?.description,
    );
  }

  disableControls() {
    _.forEach(this.workLogForm.controls, (control) => {
      control.disable();
      control.updateValueAndValidity();
    });
  }

  public onReadyEditor(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement(),
      );
  }

  onDateChange(event: Moment) {
    let today = moment();
    if (
      event.isBefore(this.workOrderService.workOrder.startDate) ||
      event.isAfter(today)
    ) {
      this.workLogForm.controls["endDateAndTime"].setErrors({
        formIsInvalid: true,
      });
    } else {
      this.workLogForm.controls["endDateAndTime"].setErrors(null);
    }
  }

  checkMinuteValidation(event: any) {
    _.inRange(Number(event.currentTarget.value), 0, 59)
      ? this.workLogForm.controls["assetMinuteDownTime"].setErrors(null)
      : this.workLogForm.controls["assetMinuteDownTime"].setErrors({
          downTimeInvalid: true,
        });
  }

  prepareWorkLogRequest(): void {
    this.workLog.activityList = this.workOrderService.workLogActivityList;
    this.workLog.personnelList = this.workOrderService.workLogPersonnelList;
    this.workLog.contractorList = this.workOrderService.workLogContractorList;
    this.workLog.partList = this.workOrderService.workLogPartList;
    this.workLog.checkListTaskList =
      this.workOrderService.workLogCheckListTasks;
    this.workLog.endDateAndTime =
      this.workLogForm.controls["endDateAndTime"].value;
    this.workLog.assetDowntimeInMinute =
      this.workLogForm.controls["assetMinuteDownTime"].value;
    this.workLog.assetDowntimeInHour =
      this.workLogForm.controls["assetHourDownTime"].value;
    this.workLog.description =
      this.workLogForm.controls["logDescription"].value;
    this.workLogRequest.workOrderId = this.workOrderService.workOrder.id;
    this.workLogRequest.workLog = this.workLog;
  }

  onSaveWorkLog() {
    this.workOrderService;
    this.prepareWorkLogRequest();
    this.dialogService
      .showConfirm({
        contentMessage: "WORK_LOG.MESSAGES.WORK_LOG_SAVE",
        warningMessages: this.waringMessage(this.workLogRequest.workLog!),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && !this.workLog.id) {
          this.createWorkLog();
        } else {
          this.updateWorkLog();
        }
      });
  }

  createWorkLog() {
    this.workLogApi.createWorkLog(this.workLogRequest).subscribe((response) => {
      this.workOrderService.workOrder.status = response.workOrder?.status;
      this.getWorkLogForWorkOrder();
      this.initForm();
      this.disableControls();
    });
  }

  updateWorkLog() {
    this.loaderService.setLoading(true);
    this.workLogApi
      .updateWorkLog(this.workLog.id!, this.workLogRequest)
      .subscribe((response) => {
        this.workOrderService.workOrder.status = response.workOrder?.status;
        this.getWorkLogForWorkOrder();
        this.initForm();
        this.disableControls();
      });
  }
  waringMessage(workLog: WorkLog): string[] {
    let warningList: string[] = [];
    if (workLog) {
      if (!workLog.personnelList) {
        warningList.push("WORK_LOG.MESSAGES.WORK_LOG_SAVE_ٌWARN2");
      }
      if (!workLog.contractorList) {
        warningList.push("WORK_LOG.MESSAGES.WORK_LOG_SAVE_ٌWARN3");
      }
      if (!workLog.partList) {
        warningList.push("WORK_LOG.MESSAGES.WORK_LOG_SAVE_ٌWARN1");
      }
    }
    return warningList;
  }

  onChangeWorkLogStatus(status: WorkLogStatus) {
    let message = "";
    let warningMessage: string[] = [];
    switch (status) {
      case WorkLogStatus.APPROVED: {
        message = "WORK_LOG.MESSAGES.WORK_LOG_APPROVED";
        warningMessage.push("WORK_LOG.MESSAGES.WORK_LOG_CONFIRM_WARN1");
        warningMessage.push("WORK_LOG.MESSAGES.WORK_LOG_CONFIRM_WARN2");
        break;
      }
      case WorkLogStatus.RETURN_FROM_APPROVED: {
        message = "WORK_LOG.MESSAGES.WORK_LOG_RETURN_FROM_APPROVED";
        break;
      }
      case WorkLogStatus.REJECT: {
        message = "WORK_LOG.MESSAGES.WORK_LOG_REJECT";
        break;
      }

      case WorkLogStatus.CALCULATED: {
        message = "WORK_LOG.MESSAGES.WORK_LOG_CALCULATED";
        warningMessage.push("WORK_LOG.MESSAGES.WORK_LOG_CALCULATED_WARN1");
        warningMessage.push("WORK_LOG.MESSAGES.WORK_LOG_CALCULATED_WARN2");
        warningMessage.push("WORK_LOG.MESSAGES.WORK_LOG_CALCULATED_WARN3");
        break;
      }
      case WorkLogStatus.RETURN_FROM_CALCULATION: {
        message = "WORK_LOG.MESSAGES.WORK_LOG_RETURN_FROM_CALCULATED";
        warningMessage.push("WORK_LOG.MESSAGES.WORK_LOG_CALCULATED_WARN1");
        warningMessage.push("WORK_LOG.MESSAGES.WORK_LOG_CALCULATED_WARN2");
        break;
      }
    }
    this.dialogService
      .showConfirm({
        contentMessage: message,
        warningMessages: warningMessage,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loaderService.setLoading(true);
          this.workLogApi
            .changeWorkLogStatus(this.workLog.id!, status)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe(() => {
              this.getWorkLogForWorkOrder();
              _.forEach(this.workLogForm.controls, (control) => {
                control.enable();
                control.updateValueAndValidity();
              });
              this.workOrderService.isWorkLogActivityInvalid.next(false);
              this.workOrderService.isWorkLogPersonInvalid.next(false);
            });
        }
      });
  }
  onDeleteWorkLog() {
    this.dialogService
      .showConfirm({
        contentMessage: "WORK_LOG.MESSAGES.WORK_LOG_DELETE",
        warningMessages: [
          "WORK_LOG.MESSAGES.WORK_LOG_DELETE_ٌWARN1",
          "WORK_LOG.MESSAGES.WORK_LOG_DELETE_ٌWARN2",
        ],
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loaderService.setLoading(true);
          this.workLogApi
            .deleteWorkLog(this.workLog.id!)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe((response: WorkOrder) => {
              this.workOrderService.workOrder = response;
              this.refreshWorkLogValues();
              _.forEach(this.workLogForm.controls, (control) => {
                control.enable();
                control.updateValueAndValidity();
              });
            });
        }
      });
  }

  getWorkLogForWorkOrder() {
    this.loaderService.setLoading(true);
    this.workLogApi
      .getWorLogWithWorkOrderId(this.workOrderService.workOrder.id!)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => {
        if (response) {
          this.workLogRequest = response;
          this.workLog = response.workLog!;
          if (this.workLog.status === WorkLogStatus.REGISTER) {
            this.disableControls();
          }
          this.initForm();
        }
      });
  }

  refreshWorkLogValues() {
    this.workOrderService.workLogContractorList = [];
    this.workOrderService.workLogPersonnelList = [];
    this.workOrderService.workLogActivityList = [];
    this.workOrderService.workLogCheckListTasks = [];
    this.workOrderService.prepareWorkingLogPersonnelPresent();
    this.workOrderService.prepareWorkingLogContractorPresent();
    this.workLogForm.reset();
    this.getWorkLogForWorkOrder();
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly WorkLogStatus = WorkLogStatus;
}
