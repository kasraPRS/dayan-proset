import { Injectable } from "@angular/core";
import { DashboardApi, ReportType } from "@proset/maintenance-client";
import { of, switchMap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ListDataService {
  constructor(private dashboardApi: DashboardApi) {}

  loadListData(reportType: ReportType, fromDate: string, toDate: string) {
    return this.dashboardApi.reportList(reportType, fromDate, toDate).pipe(
      switchMap((res: any) => {
        switch (reportType) {
          case ReportType.WORK_REQUEST_FAILURE_MODE:
          case ReportType.WORK_ORDER_FAILURE_MODE:
            return of(res.failureModeList);
          case ReportType.EXPIRED_WORK_ORDER:
            return of(res.expiredWorkOrderList);

          default:
            return of([]);
        }
      }),
    );
  }
}
