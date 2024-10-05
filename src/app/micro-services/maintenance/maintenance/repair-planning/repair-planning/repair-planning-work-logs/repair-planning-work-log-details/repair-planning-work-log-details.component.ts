import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import {
  IterationType,
  RepairPlanning,
  WorkOrder,
  WorkOrderApi,
  WorkOrderStatus,
} from "@proset/maintenance-client";
import * as moment from "jalali-moment";
import { finalize, forkJoin } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { TabType } from "../../../../work-order/enums/work-order.enum";
import { WorkOrderService } from "../../../../work-order/service/work-order.service";
import { RepairPlanningTransferService } from "../../../repair-planning-service/repair-planning-service.service";
import { ProsetDialogService } from "../../../../../../../share/service/proset-dialog.service";
import { LoaderService } from "../../../../../../../share/service/loader.service";
import { ToastService } from "../../../../../../../share/service/toast.service";

@Component({
  selector: "proset-repair-planning-work-log-details",
  templateUrl: "./repair-planning-work-log-details.component.html",
  styleUrl: "./repair-planning-work-log-details.component.less",
})
export class RepairPlanningWorkLogDetailsComponent implements OnInit {
  status = WorkOrderStatus;
  active = TabType.WORK_ORDER;
  workOrderDto: WorkOrder = {};
  mainInfoStartDate: string;
  repairPlanning: RepairPlanning;
  startDate: string;
  endDate: string;

  permission = UserPermissions;
  iterationType: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: WorkOrder | any,
    private dialogRef: MatDialogRef<RepairPlanningWorkLogDetailsComponent>,
    private _workOrderApi: WorkOrderApi,
    private _workOrderService: WorkOrderService,
    private _loaderService: LoaderService,
    private dialogService: ProsetDialogService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toasterService: ToastService,
    private _repairPlanningService: RepairPlanningTransferService,
  ) {}

  ngOnInit() {
    forkJoin([
      this.getWorkOrderById(this.data),
      this.getRepairPlanningDetails(),
    ]);
  }

  getRepairPlanningDetails() {
    this._repairPlanningService.transferData.subscribe((repairPlanning) => {
      if (repairPlanning) {
        this.repairPlanning = repairPlanning;
      }
    });
  }

  getWorkOrderById(id: number) {
    this._workOrderApi
      .getWorkOrderById(id)
      .pipe(finalize(() => this._loaderService.setLoading(false)))
      .subscribe({
        next: (response: WorkOrder) => {
          this.workOrderDto = { ...response };
          this.mainInfoStartDate = moment(
            this.workOrderDto?.date!,
            "YYYY-MM-DD",
          )
            .locale("fa")
            .format("YYYY/MM/DD");
          this.startDate = moment(
            this.workOrderDto?.startDate,
            "YYYY-MM-DDHH:mm:ss",
          )
            .locale("fa")
            .format("YYYY/MM/DD");
          this.endDate = moment(
            this.workOrderDto?.endDate,
            "YYYY-MM-DDHH:mm:ss",
          )
            .locale("fa")
            .format("YYYY/MM/DD");

          this._workOrderService.workOrder = response;
          if (response.status === this.status.UNDER_EXECUTION)
            this.active = TabType.WORK_LOG;
        },
      });
  }

  deleteWorkOrderById() {
    this.dialogService
      .showConfirm({
        height: "400px",
        width: "600px",
        size: "l",
        image: "assets/img/modal_icon.png",
        contentMessage: "WORK_ORDERS.MODAL.DELETE_WORK_ORDER",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          if (result && this.workOrderDto?.id) {
            this._workOrderApi
              .deleteWorkOrderById(this.workOrderDto?.id)
              .subscribe({
                next: (): void => {
                  this.toasterService.success(
                    "WORK_ORDERS.MESSAGES.ACTION_MESSAGE_SUCCESS",
                  );
                  this.dialogService.dismissAll();
                },
                error: (): void => {
                  this.toasterService.error(
                    "WORK_ORDERS.MESSAGES.ACTION_MESSAGE_FAIL",
                  );
                },
              });
          }
        } else {
          return;
        }
      });
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
        return "";
    }
  }
  onClose() {
    this.dialogRef.close();
    this.cdr.detectChanges();
  }
}
