import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  ActivityApi,
  ActivityStatus,
  WorkLogActivity,
} from "@proset/maintenance-client";

import { FormControl, FormGroup } from "@angular/forms";
import { finalize } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { WorkOrderService } from "../../../../service/work-order.service";
import * as _ from "lodash";
import { ScopeVars } from "../../../../../../../../share/datatable/type";

@Component({
  selector: "proset-activity-modal",
  templateUrl: "./activity-modal.component.html",
  styleUrls: [
    "./activity-modal.component.less",
    "../../../../../../../../share/datatable/datatable.component.less",
  ],
})
export class ActivityModalComponent implements OnInit {
  activityList: WorkLogActivity[];
  selectedActivityList: WorkLogActivity[] = [];
  scopeVars: ScopeVars = {};
  form: FormGroup;
  search = new FormControl();
  loading = true;
  messages = {
    emptyMessage: "",
  };

  constructor(
    private dialogRef: MatDialogRef<ActivityModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private activityApi: ActivityApi,
    private translateService: TranslateService,
    private workOrderService: WorkOrderService,
  ) {
    this.scopeVars = data;
  }

  ngOnInit(): void {
    this.getAssetActivity();
    if (this.workOrderService.workLogActivityList) {
      this.selectedActivityList = this.workOrderService.workLogActivityList;
    }
    this.translateService
      .get("ACTIVITY.MESSAGES.NO_DATA")
      .subscribe((translate) => {
        this.messages.emptyMessage = translate;
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmitClick() {
    this.workOrderService.workLogActivityList = this.selectedActivityList;
    this.workOrderService.isWorkLogActivityInvalid.next(true);
    this.dialogRef.close(this.selectedActivityList);
  }

  toggleRowCheckbox(row: WorkLogActivity, event: any) {
    if (event.currentTarget.checked) {
      this.selectedActivityList.push(row);
    } else {
      this.selectedActivityList = _.filter(
        this.selectedActivityList,
        (activity) => activity.activityId != row.activityId,
      );
    }
  }

  getAssetActivity() {
    this.loading = true;
    this.activityApi
      .getAllActivityByAssetId(this.scopeVars.data.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((result) => {
        this.activityList = _.map(result, (activity) => {
          let workLogActivity: WorkLogActivity = {};
          workLogActivity.activityId = activity.id;
          workLogActivity.activityName = activity.name;
          workLogActivity.activityCode = activity.code;
          workLogActivity.status = ActivityStatus.SUCCESSFUL;
          return workLogActivity;
        });
      });
  }

  isChecked(row: WorkLogActivity) {
    return _.find(
      this.workOrderService.workLogActivityList,
      (activity) => activity.activityId === row.activityId,
    );
  }
}
