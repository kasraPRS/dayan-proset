import { Component, Input, OnInit } from "@angular/core";
import {
  WorkLogPersonnel,
  WorkLogStatus,
  WorkOrder,
  WorkOrderStatus,
} from "@proset/maintenance-client";
import { TranslateService } from "@ngx-translate/core";
import { WorkLogPersonnelDialogComponent } from "../dialogs/work-log-personnel-dialog/work-log-personnel-dialog.component";
import { WorkOrderService } from "../../../service/work-order.service";
import * as _ from "lodash";
import { WorkLogPersonnelModel } from "../../../model/WorkLogPersonnel.model";
import { WorkLog } from "@proset/maintenance-client/model/workLog";
import { ProsetDialogService } from "../../../../../../../share/service/proset-dialog.service";
import { FormModalComponent } from "../../../../../../../share/modal-component/form-modal/form-modal.component";

@Component({
  selector: "proset-work-log-personnel",
  templateUrl: "./work-log-personnel.component.html",
  styleUrls: [
    "./work-log-personnel.component.less",
    "../../../../../../../share/datatable/datatable.component.less",
  ],
})
export class WorkLogPersonnelComponent implements OnInit {
  private _workLog: WorkLog;
  @Input() get workLog() {
    return this._workLog;
  }

  set workLog(workLog: WorkLog) {
    this._workLog = workLog;
    if (this._workLog) {
      this.workOrderService.workLogPersonnelList = this._workLog.personnelList!;
      this.personnelList =
        this.workOrderService.prepareWorkingLogPersonnelPresent();
    }
  }

  personnelList: WorkLogPersonnelModel[] = [];
  workOrder: WorkOrder;
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
      .get("PERSONNEL.MESSAGES.NO_DATA")
      .subscribe((translate) => {
        this.messages.emptyMessage = translate;
      });
    this.workOrder = this.workOrderService.workOrder;
  }

  onOpenPersonnel() {
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: WorkLogPersonnelDialogComponent,
        title: "PERSONNEL.MODAL.TITLE",
      })
      .afterClosed()
      .subscribe((response) => {
        this.personnelList =
          this.workOrderService.prepareWorkingLogPersonnelPresent();
      });
  }

  onDeletePersonnel(row: WorkLogPersonnel) {
    if (this.workOrderService.workLogPersonnelList) {
      this.personnelList = _.remove(
        this.personnelList,
        (personnel) => personnel.person?.id != row.person?.id,
      );
      this.workOrderService.workLogPersonnelList = _.remove(
        this.workOrderService.workLogPersonnelList,
        (personnel) => personnel.person?.id != row.person?.id,
      );
    }
    this.workOrderService.isWorkLogPersonInvalid.next(
      this.personnelList.length === 0,
    );
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly WorkLogStatus = WorkLogStatus;
}
