import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { WorkOrder } from "@proset/maintenance-client";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { Config, FieldType } from "../../../../../../share/datatable/type";
import { ShareService } from "../../../../../../share/service/share.service";

@Component({
  selector: "proset-repair-planning-work-logs",
  templateUrl: "./repair-planning-work-logs.component.html",
  styleUrl: "./repair-planning-work-logs.component.less",
})
export class RepairPlanningWorkLogsComponent implements OnInit {
  @Input() workOrders: WorkOrder[] = [];
  config: Config;

  permission = UserPermissions;

  constructor(
    private _shareService: ShareService,
    private _translateService: TranslateService,
    private _router: Router,
  ) {}

  ngOnInit() {
    this.config = this.initRepairPlanningWorkLogTable();
  }

  onDoubleClick(row: WorkOrder) {
    if (row.code) {
      this._router.navigate(["maintenance/work-order/view/", row.id], {
        queryParams: { isViewMode: true },
      });
    } else {
      return;
    }
  }

  initRepairPlanningWorkLogTable() {
    return {
      id: "REPAIR_PLANNING_WORK_LOG",
      limitPerPage: 0,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      list: [
        {
          type: FieldType.url,
          id: "WORK_ORDER_NUMBER",
          label: "REPAIR_PLANNING_WORK_ORDER.TABLE.WORK_ORDER_NUMBER",
          field: "code",
          minWidth: 100,
          width: 150,
          sortable: false,
          url: "/maintenance/maintenance/work-order/request/view",
        },
        {
          type: FieldType.text,
          id: "WORK_ORDER_START_DATE",
          label: "REPAIR_PLANNING_WORK_ORDER.TABLE.WORK_ORDER_START_DATE",
          field: "startDate",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value: any) => {
            return value ? this._shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "WORK_ORDER_STATUS",
          label: "REPAIR_PLANNING_WORK_ORDER.TABLE.WORK_ORDER_STATUS",
          field: "status",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value: any) => {
            return value
              ? this._translateService.instant(
                  "REPAIR_PLANNING_WORK_ORDER.TABLE.STATUSES." + value,
                )
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "WORK_ORDER_MAIN_DATE",
          label: "REPAIR_PLANNING_WORK_ORDER.TABLE.WORK_ORDER_MAIN_DATE",
          field: "createDate",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value: any) => {
            return value ? this._shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "WORK_ORDER_END_DATE",
          label: "REPAIR_PLANNING_WORK_ORDER.TABLE.WORK_ORDER_END_DATE",
          field: "endDate",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value: any) => {
            return value ? this._shareService.getJalaliDate(value) : "-";
          },
        },
      ],
    };
  }
}
