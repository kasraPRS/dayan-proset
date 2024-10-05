import { Component, Input, OnInit } from "@angular/core";
import {
  WorkLogPart,
  WorkLogStatus,
  WorkOrder,
  WorkOrderStatus,
} from "@proset/maintenance-client";
import { TranslateService } from "@ngx-translate/core";
import { WorkLogPartDialogComponent } from "../dialogs/work-log-part-dialog/work-log-part-dialog.component";
import { WorkOrderService } from "../../../service/work-order.service";
import * as _ from "lodash";
import { WorkLog } from "@proset/maintenance-client/model/workLog";
import { ProsetDialogService } from "../../../../../../../share/service/proset-dialog.service";
import { FormModalComponent } from "../../../../../../../share/modal-component/form-modal/form-modal.component";

@Component({
  selector: "proset-work-log-part",
  templateUrl: "./work-log-part.component.html",
  styleUrls: [
    "./work-log-part.component.less",
    "../../../../../../../share/datatable/datatable.component.less",
  ],
})
export class WorkLogPartComponent implements OnInit {
  private _workLog: WorkLog;
  @Input() get workLog() {
    return this._workLog;
  }

  set workLog(workLog: WorkLog) {
    this._workLog = workLog;
    if (this._workLog.partList) {
      this.partList = this._workLog.partList!;
    }
  }

  workOrder: WorkOrder;
  partList: WorkLogPart[] = [];
  messages = {
    emptyMessage: "",
  };

  constructor(
    private translateService: TranslateService,
    private dialogService: ProsetDialogService,
    private workOrderService: WorkOrderService,
  ) {}

  ngOnInit(): void {
    this.translateService
      .get("PART.MESSAGES.NO_DATA")
      .subscribe((translate) => {
        this.messages.emptyMessage = translate;
      });
    this.workOrder = this.workOrderService.workOrder;
  }

  onOpenPart() {
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: WorkLogPartDialogComponent,
        title: "PART.MODAL.TITLE",
      })
      .afterClosed()
      .subscribe(() => {
        this.partList = [...this.workOrderService.workLogPartList];
      });
  }

  onDeletePart(row: WorkLogPart) {
    this.partList = _.remove(
      this.partList,
      (part) => part.partId != row.partId,
    );
    this.workOrderService.workLogPartList = _.remove(
      this.workOrderService.workLogPartList,
      (part) => part.partId != row.partId,
    );
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly WorkLogStatus = WorkLogStatus;
}
