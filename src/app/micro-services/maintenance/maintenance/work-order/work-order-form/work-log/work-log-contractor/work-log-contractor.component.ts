import { Component, Input, OnInit } from "@angular/core";
import {
  WorkLogContractor,
  WorkLogStatus,
  WorkOrder,
  WorkOrderStatus,
} from "@proset/maintenance-client";
import { TranslateService } from "@ngx-translate/core";
import { WorkOrderService } from "../../../service/work-order.service";
import { WorkLogContractorDialogComponent } from "../dialogs/work-log-contractor-dialog/work-log-contractor-dialog.component";
import { WorkLogContractorModel } from "../../../model/WorkLogContractor.model";
import * as _ from "lodash";
import { WorkLog } from "@proset/maintenance-client/model/workLog";
import { ProsetDialogService } from "../../../../../../../share/service/proset-dialog.service";
import { FormModalComponent } from "../../../../../../../share/modal-component/form-modal/form-modal.component";

@Component({
  selector: "proset-work-log-contractor",
  templateUrl: "./work-log-contractor.component.html",
  styleUrls: [
    "./work-log-contractor.component.less",
    "../../../../../../../share/datatable/datatable.component.less",
  ],
})
export class WorkLogContractorComponent implements OnInit {
  contractorList: WorkLogContractorModel[] = [];
  workOrder: WorkOrder;
  private _workLog: WorkLog;
  @Input() get workLog() {
    return this._workLog;
  }
  set workLog(workLog: WorkLog) {
    this._workLog = workLog;
    if (this._workLog) {
      this.workOrderService.workLogContractorList =
        this._workLog.contractorList!;
      this.contractorList =
        this.workOrderService.prepareWorkingLogContractorPresent();
    }
  }
  messages = {
    emptyMessage: "",
  };

  constructor(
    private translateService: TranslateService,
    private workOrderService: WorkOrderService,
    private dialogService: ProsetDialogService,
  ) {}

  ngOnInit(): void {
    this.translateService
      .get("CONTRACTOR.MESSAGES.NO_DATA")
      .subscribe((translate) => {
        this.messages.emptyMessage = translate;
      });

    this.workOrder = this.workOrderService.workOrder;
  }

  onOpenContractorDialog() {
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: WorkLogContractorDialogComponent,
        title: "CONTRACTOR.MODAL.TITLE",
      })
      .afterClosed()
      .subscribe((response) => {
        this.contractorList =
          this.workOrderService.prepareWorkingLogContractorPresent();
      });
  }

  onDeleteContractor(row: WorkLogContractor) {
    this.contractorList = _.remove(
      this.contractorList,
      (contractor) => contractor.person?.id != row.person?.id,
    );
    this.workOrderService.workLogContractorList = _.remove(
      this.workOrderService.workLogContractorList,
      (contractor) => contractor.person?.id != row.person?.id,
    );
    this.workOrderService.isWorkLogPersonInvalid.next(
      this.contractorList.length === 0,
    );
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly WorkLogStatus = WorkLogStatus;
}
