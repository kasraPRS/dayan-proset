import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import {
  CodeGeneratorApi,
  GeneratorEntityType,
  RepairPlanning,
  RepairPlanningApi,
  RepairPlanningStatus,
  RepairPlanningWorkOrder,
  WorkOrderApi,
  WorkOrderStatus,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { FORM_MODE } from "src/app/share/enums/enums";
import { TabType } from "./enum/repair-planning.enum";
import { RepairPlanningTransferService } from "../repair-planning-service/repair-planning-service.service";
import { RepairPlanningWorkLogDetailsComponent } from "./repair-planning-work-logs/repair-planning-work-log-details/repair-planning-work-log-details.component";
import { CalendarEvent } from "../../../../../share/model/calendar-event";
import { LoaderService } from "../../../../../share/service/loader.service";
import { ProsetDialogService } from "../../../../../share/service/proset-dialog.service";

@Component({
  selector: "proset-repair-planning",
  templateUrl: "./repair-planning.component.html",
  styleUrl: "./repair-planning.component.less",
})
export class RepairPlanningComponent implements OnInit {
  repairPlanning: RepairPlanning = { code: "" };
  repairPlanningUUid: string;
  @Input() viewType: FORM_MODE;
  @Input() id: number;
  active = TabType.REPAIR_PLANNING_CREATE;
  status = RepairPlanningStatus;
  workOrders: RepairPlanningWorkOrder[];
  calendarEvents: CalendarEvent[] = [];
  workOrdersThatHaveWorkOrderCode: RepairPlanningWorkOrder[];

  constructor(
    private _loaderService: LoaderService,
    private _codeGenerator: CodeGeneratorApi,
    private _repairPlanning: RepairPlanningApi,
    private _workOrderApi: WorkOrderApi,
    private dialogService: ProsetDialogService,
    private cdr: ChangeDetectorRef,
    private _repairPlanningService: RepairPlanningTransferService,
  ) {}

  ngOnInit() {
    this.getParams();
    this.initCalendar();
    this.cdr.detectChanges();
  }

  getParams() {
    if (this.id) {
      this.getRepairPlanningById(this.id);
    } else {
      this.generateCode();
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    window.dispatchEvent(new Event("resize"));
  }

  initCalendar() {
    if (this.workOrders.length > 0) {
      this.calendarEvents = this.workOrders.map((value) => {
        const event: CalendarEvent = {
          title: this._repairPlanningService.transferData.getValue().name,
          id: value?.code! || "-",
          start: value?.startDate! || "-",
          end: value?.endDate! || "-",
          extendedProps: {
            background: this.assignPriorityColorToEvent(value.status),
            code: value?.code,
            id: value?.id,
            actions: [],
            start: value?.startDate!,
            end: value?.endDate,
          },
        };
        if (value.isRejected) {
          event.extendedProps?.actions?.push({
            icon: "isax isax-dislike disaccept-color",
          });
        }
        return event;
      });
    }
    window.dispatchEvent(new Event("resize"));
  }

  assignPriorityColorToEvent(status: any) {
    switch (status) {
      case WorkOrderStatus.OPEN:
        return "#D1A6F4";
      case WorkOrderStatus.UNDER_EXECUTION:
        return "#FDAB3D";
      case WorkOrderStatus.WORK_LOG:
        return "#62A0FF";
      case WorkOrderStatus.FINISHED:
        return "#46BB6E";
      default:
        return ""; // Or any default color if needed
    }
  }

  onCalendarEventClick(info: any) {
    var eventObj = info.event;
    if (
      eventObj.extendedProps?.code !== null &&
      eventObj.extendedProps?.code !== undefined
    ) {
      window.open("maintenance/work-order/view/" + eventObj.extendedProps?.id);
    } else {
      this.dialogService
        .showWithComponent(RepairPlanningWorkLogDetailsComponent, {
          size: "l",
          image: "assets/img/modal_icon.png",
          contentMessage: "MESSAGES.DELETE_CONFIRM",
          data: eventObj.extendedProps?.id!,
        })
        .afterClosed()
        .subscribe((result) => {
          this.getParams();
        });
    }
  }

  generateCode(): void {
    this._codeGenerator
      .generateCode(GeneratorEntityType.REPAIR_PLANNING)
      .pipe(finalize(() => this._loaderService.setLoading(false)))
      .subscribe((response) => {
        this.repairPlanning.code = response.code!;
      });
  }

  getRepairPlanningById(id: number) {
    // this.repairPlanning = {
    //   ...this.repairPlanning,
    //   uuid: ""
    // }
    this._loaderService.setLoading(true);
    this._repairPlanning
      .getRepairPlanningById(id)
      .pipe(finalize(() => this._loaderService.setLoading(false)))
      .subscribe((response) => {
        if (response) {
          this.repairPlanning = { ...response };
          this.getAllWorkOrderByRepairPlanningId(id);
          this._repairPlanningService.transferData.next(this.repairPlanning);
          if (this.repairPlanning.status === this.status.UNDER_EXECUTION) {
            this.active = TabType.REPAIR_PLANNING_LOG;
          }
        }
      });
  }
  getAllWorkOrderByRepairPlanningId(id: number) {
    this.workOrders = [];
    this.calendarEvents = [];
    this._loaderService.setLoading(true);
    this._workOrderApi
      .getAllWOrkOrderByRepairPlanningId(Number(id))
      .pipe(finalize(() => this._loaderService.setLoading(false)))
      .subscribe((response) => {
        if (response) {
          this.workOrders = response;
          this.initCalendar();
          this.workOrdersThatHaveWorkOrderCode = this.workOrders.filter(
            (item) => item.code !== null,
          );
        }
      });
  }

  onNavigate(tab: TabType) {
    this.active = tab;
  }
}
