import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { WorkOrder, WorkOrderType } from "@proset/maintenance-client";
import * as moment from "jalali-moment";
import { FormSharedService } from "../../../../../../../share/service/form-share.service";

@Component({
  selector: "proset-work-order-datepicker",
  templateUrl: "./work-order-datepicker.component.html",
  styleUrl: "./work-order-datepicker.component.less",
})
export class WorkOrderDatepickerComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() workOrder: WorkOrder;
  workOrderType = WorkOrderType.PREVENTIVE;
  scheduleStartDate: any;
  scheduleEndDate: any;
  endDate: any;

  constructor(private formShareService: FormSharedService) {}

  ngOnInit() {
    this.setEndDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentVal = changes["form"]?.currentValue;
    if (currentVal) {
      if (this.workOrder.type === this.workOrderType) {
        this.form.controls["endDate"].disable();
        this.scheduleStartDate = this.workOrder.repairPlanning?.startDate!;
        this.scheduleStartDate = new Date(this.scheduleStartDate);
        this.scheduleEndDate = this.workOrder.repairPlanning?.endDate!;
        this.scheduleEndDate = new Date(this.scheduleEndDate);
      } else {
        return;
      }
    }
  }

  setEndDate() {
    if (this.workOrder.type === this.workOrderType) {
      this.form.controls["startDate"].valueChanges.subscribe((change) => {
        this.endDate = change;
        const parsedDate = moment(this.endDate, "YYYY-MM-DD HH:mm");

        if (parsedDate.isValid()) {
          parsedDate.format("YYYY-MM-DD HH:mm");
          this.endDate = parsedDate.set({ hour: 23, minute: 59 });
          this.form.controls["endDate"].patchValue(this.endDate);
        }
      });
    } else {
      return;
    }
  }

  formStyle(key: string, form: FormGroup) {
    return this.formShareService.formStyle(key, form);
  }
}
