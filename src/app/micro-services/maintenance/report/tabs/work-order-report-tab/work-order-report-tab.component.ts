import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  Count,
  DashboardApi,
  ReportType,
  WorkOrderStatus,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { Config, FieldType } from "src/app/share/datatable/type";
import { assignPriorityColorToEvent } from "src/app/share/helper/business-colors";

@Component({
  selector: "proset-work-order-report-tab",
  templateUrl: "./work-order-report-tab.component.html",
  styleUrl: "./work-order-report-tab.component.less",
})
export class WorkOrderReportTabComponent implements OnInit, OnChanges {
  @Input() fromDate: string;
  @Input() toDate: string;

  ReportType = ReportType;
  public loadingStates = {
    CREATED_WORK_ORDER: false,
    CREATED_WORK_REQUEST: false,
    EXPIRED_WORK_ORDER: false,
    FINISHED_WORK_ORDER: false,
    WORK_ORDER_FAILURE_MODE: false,
    WORK_ORDER_PRIORITY: false,
    WORK_ORDER_STATUS: false,
    WORK_ORDER_TYPE: false,
    WORK_REQUEST_FAILURE_MODE: false,
    WORK_REQUEST_STATUS: false,
    WORK_ORDER_COST_BY_TYPE: false,
  };

  workOrderStatusCount: Count;
  workOrderTypeToggle = false;
  workOrderExpiredToggle = false;

  workOrderCostPieOption: any;

  // WORK_ORDER_FAILURE_MODE_LIST
  workOrderFailureModeTableConfig: Config;
  workOrderFailureModeList: any = [];

  // WORK_ORDER_Expired_LIST
  workOrderExpiredTableConfig: Config;
  workOrderExpiredList: any = [];

  constructor(
    private dashboardApi: DashboardApi,
    private translateService: TranslateService,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (
      !changes["fromDate"]?.isFirstChange() &&
      !changes["toDate"]?.isFirstChange() &&
      (changes["fromDate"]?.previousValue !=
        changes["fromDate"]?.currentValue ||
        changes["toDate"]?.previousValue != changes["toDate"]?.currentValue)
    ) {
      this.loadData();
    }
  }

  ngOnInit() {
    this.loadData();
    this.initDataTable();
  }

  loadData() {
    this.dashboardApi
      .countChart(ReportType.WORK_ORDER_STATUS, this.fromDate, this.toDate)
      .pipe(
        finalize(() => {
          this.setLoadingState(ReportType.WORK_ORDER_STATUS, false);
        }),
      )
      .subscribe((res: Count) => {
        this.workOrderStatusCount = res;

        const statusOrder = [
          WorkOrderStatus.OPEN,
          WorkOrderStatus.UNDER_EXECUTION,
          WorkOrderStatus.WORK_LOG,
          WorkOrderStatus.FINISHED,
        ];

        if (this.workOrderStatusCount.workOrderStatusList)
          this.workOrderStatusCount.workOrderStatusList.sort((a, b) => {
            return (
              statusOrder.indexOf(a.status!) - statusOrder.indexOf(b.status!)
            );
          });
      });
  }

  public setLoadingState(
    state: keyof typeof this.loadingStates,
    value: boolean,
  ) {
    this.loadingStates[state] = value;
  }

  public getLoadingState(state: keyof typeof this.loadingStates): boolean {
    return this.loadingStates[state];
  }

  initDataTable() {
    this.workOrderFailureModeTableConfig = {
      limitPerPage: 5,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "WorkOrder FailureMode List",
      list: [
        {
          type: FieldType.text,
          id: "REPORT_TABLE_NAME",
          label: "REPORT.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPORT_TABLE_CODE",
          label: "REPORT.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 50,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPORT_TABLE_ASSET_NAME",
          label: "REPORT.TABLE.ASSET_NAME",
          field: "assetName",
          minWidth: 50,
          width: 120,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPORT_TABLE_COUNT",
          label: "REPORT.TABLE.COUNT",
          field: "count",
          minWidth: 50,
          width: 50,
          sortable: false,
        },
      ],
    };

    this.workOrderExpiredTableConfig = {
      limitPerPage: 5,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "WorkOrder Expired List",
      list: [
        {
          type: FieldType.text,
          id: "REPORT_TABLE_WORK_ORDER",
          label: "REPORT.TABLE.WORK_ORDER",
          field: "name",
          minWidth: 50,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPORT_TABLE_ASSET",
          label: "REPORT.TABLE.ASSET",
          field: "assetName",
          minWidth: 50,
          width: 120,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPORT_TABLE_ASSET_CODE",
          label: "REPORT.TABLE.ASSET_CODE",
          field: "assetCode",
          minWidth: 50,
          width: 50,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPORT_TABLE_PRIORITY",
          label: "REPORT.TABLE.PRIORITY",
          field: "priority",
          minWidth: 50,
          width: 50,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("PRIORITY." + value)
              : "-";
          },
        },
        {
          type: FieldType.date,
          id: "REPORT_TABLE_END_DATE",
          label: "REPORT.TABLE.END_DATE",
          field: "endDate",
          minWidth: 50,
          width: 50,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "REPORT_TABLE_DAY_AFTER_END_DATE",
          label: "REPORT.TABLE.DAY_AFTER_END_DATE",
          field: "dayAfterEndDate",
          minWidth: 50,
          width: 50,
          sortable: false,
          translator: (value) => {
            return value
              ? String(value).concat(
                  " " + this.translateService.instant("CALENDAR.DAY"),
                )
              : this.translateService.instant("CALENDAR.TODAY");
          },
        },
      ],
    };
  }

  getOrderColorByStatus(status: WorkOrderStatus) {
    return assignPriorityColorToEvent(status);
  }
}
