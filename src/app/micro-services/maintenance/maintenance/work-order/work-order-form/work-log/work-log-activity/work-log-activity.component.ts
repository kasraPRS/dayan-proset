import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  ActivityStatus,
  WorkLogActivity,
  WorkLogStatus,
  WorkOrder,
  WorkOrderStatus,
  WorkOrderType,
} from "@proset/maintenance-client";
import { TranslateService } from "@ngx-translate/core";
import { WorkOrderService } from "../../../service/work-order.service";
import * as _ from "lodash";
import { ActivityModalComponent } from "../dialogs/activity-modal/activity-modal.component";
import { WorkLog } from "@proset/maintenance-client/model/workLog";
import { ProsetDialogService } from "../../../../../../../share/service/proset-dialog.service";

@Component({
  selector: "proset-work-log-activity",
  templateUrl: "./work-log-activity.component.html",
  styleUrls: [
    "./work-log-activity.component.less",
    "../../../../../../../share/datatable/datatable.component.less",
  ],
})
export class WorkLogActivityComponent implements OnInit {
  @ViewChild("myTable") table: any;
  messages = {
    emptyMessage: "",
  };
  activityList: WorkLogActivity[];
  activityStatusList: string[];
  workOrderDto: WorkOrder;
  isDisable = false;
  private _workLog: WorkLog;
  @Input() get workLog() {
    return this._workLog;
  }
  set workLog(workLog: WorkLog) {
    this._workLog = workLog;
    if (this._workLog) {
      this.activityList = this._workLog.activityList!;
      this.workOrderService.workLogActivityList = this.workLog.activityList!;
    }
  }
  protected readonly WorkOrderType = WorkOrderType;

  constructor(
    private translateService: TranslateService,
    public workOrderService: WorkOrderService,
    private dialogService: ProsetDialogService,
  ) {}

  ngOnInit(): void {
    this.translateService
      .get("ACTIVITY.MESSAGES.NO_DATA")
      .subscribe((translate) => {
        this.messages.emptyMessage = translate;
      });
    this.activityStatusList = Object.keys(ActivityStatus);
    this.workOrderDto = this.workOrderService.workOrder;
    this.workOrderService.workLogActivityList = this.activityList;
  }

  OnDeleteActivity(row: WorkLogActivity) {
    this.activityList = _.remove(
      this.activityList,
      (activity) => activity.activityId != row.activityId,
    );
    this.workOrderService.workLogActivityList = this.activityList;
  }

  onChangeStatus(row: WorkLogActivity, event: ActivityStatus) {
    let activity = _.first(
      _.filter(
        this.activityList,
        (activity: WorkLogActivity) => activity.activityId === row.activityId,
      ),
    );
    if (activity) {
      activity.status = event;
    }
  }

  onSelectActivity() {
    this.dialogService
      .showWithFormComponent(ActivityModalComponent, {
        title: "ACTIVITY.MODAL.TITLE",
        data: this.workOrderService.workOrder.asset,
      })
      .afterClosed()
      .subscribe(() => {
        this.activityList = [...this.workOrderService.workLogActivityList];
      });
  }

  protected readonly ActivityStatus = ActivityStatus;
  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly WorkLogStatus = WorkLogStatus;
}
