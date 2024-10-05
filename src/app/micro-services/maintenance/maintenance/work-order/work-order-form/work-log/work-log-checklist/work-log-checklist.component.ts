import { Component, Input, OnInit } from "@angular/core";
import {
  RepairPlanningApi,
  Task,
  WorkLogCheckListTask,
  WorkOrder,
} from "@proset/maintenance-client";
import { WorkOrderService } from "../../../service/work-order.service";
import * as _ from "lodash";
import { WorkLog } from "@proset/maintenance-client/model/workLog";
import { WorkLogTaskModel } from "../../../model/workLogTask.model";
import { finalize } from "rxjs";
import { LoaderService } from "../../../../../../../share/service/loader.service";

@Component({
  selector: "proset-work-log-checklist",
  templateUrl: "./work-log-checklist.component.html",
  styleUrl: "./work-log-checklist.component.less",
})
export class WorkLogChecklistComponent implements OnInit {
  workOrder: WorkOrder;
  private _workLog: WorkLog;
  isDisable = false;
  @Input() get workLog() {
    return this._workLog;
  }
  set workLog(workLog: WorkLog) {
    this._workLog = workLog;
    if (this._workLog.checkListTaskList) {
      this.isDisable = true;
    } else {
      this.isDisable = false;
    }
  }
  constructor(
    public workOrderService: WorkOrderService,
    private repairPlaningApi: RepairPlanningApi,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.workOrder = this.workOrderService.workOrder;
    this.getTask();
  }

  getTask(): Task[] {
    this.loaderService.setLoading(true);
    let taskList: Task[] = [];
    this.repairPlaningApi
      .getCheckListByWorkOrderId(this.workOrder.id!)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => {
        _.forEach(response, (task) => {
          if (!this._workLog.checkListTaskList) {
            this.initTaskList(task);
          } else {
            this.initSavedTaskList(this._workLog.checkListTaskList, task);
          }
        });
      });
    return taskList;
  }

  initTaskList(task: Task) {
    let workLogTask: WorkLogTaskModel = {};
    workLogTask.taskId = task.id;
    workLogTask.measurementName = task.measurement?.name;
    workLogTask.name = task.name;
    workLogTask.type = task.type;
    // by default task set as false, when change it will be set as true.
    workLogTask.isDone = false;
    this.workOrderService.workLogCheckListTasks.push(workLogTask);
  }

  initSavedTaskList(workLogCheckListTask: WorkLogCheckListTask[], task: Task) {
    let workLogTaskModel: WorkLogTaskModel = {};
    let workLogTask = _.find(
      workLogCheckListTask,
      (_task) => _task.taskId === task.id,
    );
    if (workLogTask) {
      workLogTaskModel.taskId = workLogTask.taskId;
      workLogTaskModel.type = task.type;
      workLogTaskModel.name = task.name;
      workLogTaskModel.measurementName = task.measurement?.name;
      workLogTaskModel.isDone = workLogTask.isDone;
      workLogTaskModel.value = workLogTask.value;
      workLogTaskModel.description = workLogTask.description;
      this.workOrderService.workLogCheckListTasks.push(workLogTaskModel);
    }
  }
  onCheckTask(task: WorkLogTaskModel, event: any) {
    let workLogTask = _.find(
      this.workOrderService.workLogCheckListTasks,
      (_task) => _task.taskId === task.taskId,
    );
    if (workLogTask) {
      workLogTask.isDone = event.target.checked;
    }
  }
}
