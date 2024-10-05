import { Component, Input, OnInit } from "@angular/core";
import { WORK_ORDER_DATA_ENTRY_TYPES } from "../enums/work-order.enum";
import {
  CodeGeneratorApi,
  GeneratorEntityType,
  WorkOrder,
  WorkOrderApi,
  WorkOrderStatus,
  WorkRequestApi,
} from "@proset/maintenance-client";
import { FORM_MODE } from "src/app/share/enums/enums";
import { WorkOrderService } from "../service/work-order.service";
import { WorkLog } from "@proset/maintenance-client/model/workLog";

@Component({
  selector: "proset-work-order-form",
  templateUrl: "./work-order-form.component.html",
  styleUrl: "./work-order-form.component.less",
})
export class WorkOrderFormComponent implements OnInit {
  @Input() code: string;
  @Input() id: number;
  @Input() viewType: FORM_MODE;
  @Input() workOrderFormDataEntryType: WORK_ORDER_DATA_ENTRY_TYPES;
  status = WorkOrderStatus;
  workOrderDto: WorkOrder = {};
  workLog: WorkLog;
  protected readonly WorkOrderStatus = WorkOrderStatus;

  constructor(
    private workOrderApi: WorkOrderApi,
    private codeGenerator: CodeGeneratorApi,
    private requestApi: WorkRequestApi,
    private workOrderService: WorkOrderService,
  ) {}

  ngOnInit(): void {
    this.getParams();
  }

  getParams() {
    if (this.id) {
      this.getWorkOrderById(this.id);
    } else if (
      this.code &&
      this.workOrderFormDataEntryType ===
        WORK_ORDER_DATA_ENTRY_TYPES.GET_WORK_ORDER_BY_CODE
    ) {
      this.getWorkOrderByCode(this.code);
    } else if (
      this.id &&
      this.workOrderFormDataEntryType ===
        WORK_ORDER_DATA_ENTRY_TYPES.CREATE_WORK_ORDER_FROM_WORK_REQUEST
    ) {
      this.setDefaultValueOfWorkOrderFromWorkRequest();
    } else {
      this.generateCode();
    }
  }

  setDefaultValueOfWorkOrderFromWorkRequest() {
    this.getWorkRequestById(this.id);
    this.generateCode();
  }

  getWorkOrderByCode(code: string) {
    this.workOrderApi.getWorkOrderByCode(code).subscribe({
      next: (response: WorkOrder) => {
        if (response) {
          this.workOrderDto = { ...response };
          this.workOrderService.workOrder = response;
        }
      },
    });
  }
  getWorkOrderById(id: number) {
    this.workOrderApi.getWorkOrderById(id).subscribe({
      next: (response: WorkOrder) => {
        if (response) {
          this.workOrderDto = { ...response };
          this.workOrderService.workOrder = response;
        }
      },
    });
  }
  getWorkRequestById(id: number) {
    this.requestApi.getWorkRequestById(id).subscribe({
      next: (response) => {
        this.workOrderDto = {
          ...this.workOrderDto,
          workRequest: response,
          asset: response.asset,
        };
      },
    });
  }
  generateCode(): void {
    this.codeGenerator
      .generateCode(GeneratorEntityType.WORK_ORDER)
      .subscribe((response) => {
        this.workOrderDto.code = response.code!;
      });
  }
}
