import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  Count,
  DashboardApi,
  ReportType,
  WorkRequestStatus,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { Config, FieldType } from "src/app/share/datatable/type";
import { ChartsService } from "src/app/share/service/charts.service";

export interface DateRangeItem {
  month: number;
  year: number;
  value: number;
}

@Component({
  selector: "proset-work-request-report-tab",
  templateUrl: "./work-request-report-tab.component.html",
  styleUrl: "./work-request-report-tab.component.less",
})
export class WorkRequestReportTabComponent implements OnInit, OnChanges {
  @Input() fromDate: string;
  @Input() toDate: string;

  workRequestStatus = WorkRequestStatus;
  reportResult: Count = {};
  workOrderFailureModeTableConfig: Config;
  ReportType = ReportType;

  public loadingStates = {
    CREATED_WORK_REQUEST: false,
    WORK_REQUEST_FAILURE_MODE: false,
    WORK_REQUEST_STATUS: false,
  };

  workRequestCountChartOption: any;

  constructor(
    private dashboardApi: DashboardApi,
    private chartsService: ChartsService,
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

  ngOnInit(): void {
    this.initDataTable();
    this.loadData();
  }

  loadData() {
    this.dashboardApi
      .countChart(ReportType.WORK_REQUEST_STATUS, this.fromDate, this.toDate)
      .pipe(
        finalize(() => {
          this.setLoadingState(ReportType.CREATED_WORK_REQUEST, false);
        }),
      )
      .subscribe((res) => {
        this.reportResult = res;
        this.workRequestCountChartOption =
          this.chartsService.composeSolidGaugeChart(
            [
              {
                name: "",
                data: [res.total],
              },
            ],
            res.total ? res.total.toString() : "0",
          );
      });
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

  calcPercent(value: any, total: any) {
    return value && total ? (value / total) * 100 : 0;
  }
}
