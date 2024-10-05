import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TranslateModule } from "@ngx-translate/core";
import { ReportType } from "@proset/maintenance-client";
import * as Highcharts from "highcharts";
import { HighchartsChartModule } from "highcharts-angular";
import { finalize } from "rxjs";
import { ChartViewType } from "../../micro-services/maintenance/report/model/chart";
import { ChartDataService } from "../../micro-services/maintenance/report/service/chart-data.service";

@Component({
  selector: "proset-chart",
  templateUrl: "./proset-chart.component.html",
  styleUrls: ["./proset-chart.component.less"],
  standalone: true,
  imports: [
    CommonModule,
    HighchartsChartModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
})
export class ProsetChartComponent implements OnInit, OnChanges {
  HighCharts: typeof Highcharts = Highcharts;
  chartOption: Highcharts.Options;
  @Input() height: number = 326;
  @Input() maxWidth?: number;
  @Input() chartTitle?: string;

  @Input() chartViewType: ChartViewType;
  @Input({ required: true }) reportType: any;
  @Input({ required: true }) fromDate: string;
  @Input({ required: true }) toDate: string;

  loading?: boolean = true;
  updateFlag = false;

  @Input() set chartData(val: Highcharts.Options) {
    if (val) {
      this.chartOption = val;
      this.updateFlag = true;
      this.loading = false;
    }
  }

  constructor(private countChartDataService: ChartDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes["reportType"]?.currentValue !=
        changes["reportType"]?.previousValue ||
        changes["fromDate"]?.currentValue !=
          changes["fromDate"]?.previousValue ||
        changes["toDate"]?.currentValue != changes["toDate"]?.previousValue) &&
      !changes["reportType"]?.firstChange
    ) {
      this.loadChart();
    }
  }

  ngOnInit(): void {
    this.loadChart();
  }

  loadChart() {
    // TODO: remove chartData input and this line after all chart type implement
    if (this.chartData) {
      this.loading = false;
      return;
    }

    if (this.fromDate && this.toDate) {
      this.loading = true;
      this.countChartDataService
        .loadChartOption(
          this.reportType,
          this.chartViewType,
          this.fromDate,
          this.toDate,
        )
        .pipe(
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe((res) => {
          this.chartOption = res;
        });
    }
  }
}
