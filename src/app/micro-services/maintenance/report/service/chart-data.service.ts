import { Injectable } from "@angular/core";
import {
  Count,
  DashboardApi,
  Priority,
  ReportType,
  WorkOrderType,
} from "@proset/maintenance-client";
import { of, switchMap } from "rxjs";
import { ChartsService } from "../../../../share/service/charts.service";
import { ChartViewType } from "../model/chart";

@Injectable({
  providedIn: "root",
})
export class ChartDataService {
  constructor(
    private dashboardApi: DashboardApi,
    private chartsService: ChartsService,
  ) {}

  chartOption: Highcharts.Options;

  loadChartOption(
    reportType: ReportType,
    chartViewType: ChartViewType,
    fromDate: string,
    toDate: string,
  ) {
    return this.dashboardApi
      .countChart(reportType, fromDate, toDate)
      .pipe(
        switchMap((res: any) =>
          this.generateChartOption(res, chartViewType, reportType),
        ),
      );
  }

  generateChartOption(
    res: Count,
    chartViewType: ChartViewType,
    type: ReportType,
  ) {
    switch (type) {
      case ReportType.WORK_ORDER_PRIORITY: {
        const workOrderPrioritys = Object.values(Priority);
        const result = workOrderPrioritys.map((priority) => [
          priority,
          res.workOrderPriorityList?.find((item) => item.priority === priority)
            ?.count ?? 0,
        ]);

        return of(
          this.chartsService.composePieChart(result, "PRIORITY", res.total, [
            "rgba(223, 210, 250, 1)",
            "rgba(249, 204, 204, 1)",
            "rgba(255, 238, 216, 1)",
            "rgba(72, 118, 255, 0.1)",
          ]),
        );
      }

      case ReportType.WORK_ORDER_TYPE: {
        const workOrderTypes = Object.values(WorkOrderType);

        const result = workOrderTypes.map((type) => [
          type,
          res.workOrderTypeList?.find((item) => item.type === type)?.count ?? 0,
        ]);

        if (chartViewType == "bar")
          return of(
            this.chartsService.composePieChart(
              result,
              "WORK_ORDERS.WORK_ORDER_TYPE",
              res.total,
              [
                "rgba(0, 152, 120, 1)",
                "rgba(227, 0, 0, 1)",
                "rgba(72, 118, 255, 1)",
              ],
            ),
          );
        else
          return of(
            this.chartsService.composeBarChart(
              result.map((m: any) => m[0]),
              result.map((m: any) => m[1]),
              "WORK_ORDERS.WORK_ORDER_TYPE",
            ),
          );
      }

      case ReportType.CREATED_WORK_ORDER: {
        const data =
          res.createdWorkOrderList?.map((item) => [
            item.month?.concat(" ", item.year || ""),
            item.count,
          ]) || [];

        return of(
          this.chartsService.composeMonthlyLineChart(
            data?.map((d) => d[0]),
            data?.map((d) => d[1]),
            [],
          ),
        );
      }
      case ReportType.FINISHED_WORK_ORDER: {
        const data =
          res.finishedWorkOrderList?.map((item) => [
            item.month?.concat(" ", item.year || ""),
            item.count,
          ]) || [];

        return of(
          this.chartsService.composeMonthlyLineChart(
            data.map((d) => d[0]),
            data.map((d) => d[1]),
            [],
          ),
        );
      }
      case ReportType.EXPIRED_WORK_ORDER: {
        const workOrderPriority = Object.values(Priority);
        const result = workOrderPriority.map((type) => [
          type,
          res.workOrderPriorityList?.find((item) => item.priority === type)
            ?.count ?? 0,
        ]);
        return of(
          this.chartsService.composeBarChart(
            result.map((m: any) => m[0]),
            result.map((m: any) => m[1]),
            "WORK_ORDERS.PRIORITY",
            res.total,
            ["#4876FF1A", "#FDAB3D", "#E30000", "#5D1CE8"],
          ),
        );
      }
      case ReportType.CREATED_WORK_REQUEST: {
        const data =
          res.createdWorkRequestList?.map((item) => [
            item.month?.concat(" ", item.year || ""),
            item.count,
          ]) || [];

        return of(
          this.chartsService.composeMonthlyLineChart(
            data.map((d) => d[0]),
            data.map((d) => d[1]),
            [],
          ),
        );
      }
      case ReportType.WORK_ORDER_STATUS:
      case ReportType.WORK_ORDER_FAILURE_MODE:
      case ReportType.WORK_REQUEST_STATUS:
      case ReportType.WORK_REQUEST_FAILURE_MODE:
      default:
        return of();
    }
  }
}
