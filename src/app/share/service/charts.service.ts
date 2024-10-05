import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as HighCharts from "highcharts";
import * as _ from "lodash";

@Injectable({
  providedIn: "root",
})
export class ChartsService {
  constructor(translateService: TranslateService) {
    ChartsService.translateService = translateService;
    HighCharts.setOptions({
      lang: {
        numericSymbols: [],
        thousandsSep: ",",
      },
      chart: {
        style: {
          fontFamily: "var(--proset-font-family)",
        },
      },
    });
  }

  static translateService: TranslateService;

  private static get pieChartColors(): any {
    const colors = [];
    const arr = [
      "#6610f2",
      "#78ffd6",
      "#39393a",
      "#e6e6e6",
      "#06d6a0",
      "#f42272",
      "#b892ff",
      "#d81e5b",
      "#533a7b",
      "#98c1d9",
    ];
    for (let i = 0; i < 10; i++) {
      colors.push(
        i % 10 == 0
          ? arr[i]
          : HighCharts.color(arr[i])
              .brighten((i - 3) / 7)
              .get(),
      );
    }
    return colors;
  }

  composePieChart(
    data: any,
    translatePrefix: string,
    total?: number,
    colors: string[] = [],
  ): any {
    return {
      chart: {
        type: "pie",
      },
      title: {
        text: "",
      },
      subtitle: {
        verticalAlign: "middle",
        floating: true,
        text: total,
        style: {
          fontFamily: "var(--proset-font-family)",
          fontSize: "40px",
          fontWeight: 400,
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        style: {
          fontFamily: "var(--proset-font-family)",
          unicodeBidi: "plaintext",
        },
        pointFormat: "<b>{point.percentage:.1f}%</b>",
        formatter: function (): any {
          const self: any = this;
          return (
            "<b>" +
            HighCharts.numberFormat(self.point.percentage, 1) +
            "%</b><br/>" +
            ChartsService.translateService.instant(
              translatePrefix + "." + self.point.name,
            )
          );
        },
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          borderWidth: 0,
          colorByPoint: true,
          type: "pie",
          size: "100%",
          innerSize: "80%",
          allowPointSelect: true,
          cursor: "pointer",
          colors: colors.length ? colors : ChartsService.pieChartColors,
          showInLegend: true,

          borderColor: null,
          slicedOffset: 20,

          dataLabels: {
            enabled: false,
            style: {
              fontFamily: "var(--proset-font-family)",
              fontSize: "12px",
              fontWeight: 400,
            },
            format: "<b>{point.percentage:.1f}%</b>",
          },
        },
        series: {
          colorByPoint: true,

          stickyTracking: true,
          events: {
            mouseOver: function () {
              const self: any = this;
              const series = self?.chart?.series;
              series.forEach((s: any) => {
                s.update({
                  dataLabels: {
                    enabled: true,
                  },
                });
              });
            },
            mouseOut: function () {
              const self: any = this;
              const series = self?.chart?.series;
              series.forEach((s: any) => {
                s.update({
                  dataLabels: {
                    enabled: false,
                  },
                });
              });
            },
          },
        },
      },
      legend: {
        enabled: true,
        layout: "horizontal",
        floating: false,
        verticalAlign: "bottom",
        y: 20,
        itemStyle: {
          fontFamily: "var(--proset-font-family)",
          fontSize: "14px",
          fontWeight: 700,
        },
        labelFormatter: function (this: any) {
          return ChartsService.translateService.instant(
            translatePrefix + "." + this.name,
          );
        },
      },
      series: [
        {
          name: "",
          colorByPoint: true,
          data,
        },
      ],
    };
  }

  composeBarChart(
    categories: string[],
    data: any,
    translatePrefix: string,
    total?: number,
    colors: string[] = [],
  ): any {
    const maxVal = _.max(data);

    return {
      chart: {
        type: "column",
        className: "bar-chart",
      },
      title: {
        text: "",
        style: {
          fontFamily: "var(--proset-font-family)",
          fontSize: "14px",
          fontWeight: 700,
        },
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: categories,
        crosshair: true,
        labels: {
          style: {
            fontFamily: "var(--proset-font-family)",
            unicodeBidi: "plaintext",
          },
          formatter: function () {
            const self: any = this;
            return ChartsService.translateService.instant(
              translatePrefix + "." + self.value,
            );
          },
        },
      },
      yAxis: {
        max: maxVal,
        min: 0,
        title: {
          text: "",
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        style: {
          fontFamily: "var(--proset-font-family)",
          unicodeBidi: "plaintext",
        },
        formatter: function (): any {
          const self: any = this;
          return (
            "<b>" +
            HighCharts.numberFormat(self.point.percentage, 1) +
            "%</b><br/>" +
            ChartsService.translateService.instant(
              translatePrefix + "." + self.point.category,
            )
          );
        },
      },
      plotOptions: {
        column: {
          stacking: "stream",
          pointPadding: 0,
          borderWidth: 0,
          events: {
            legendItemClick: function () {
              return false;
            },
          },
        },
      },
      series: [
        {
          name: "",
          data: data.map(() => maxVal),
          color: "#E1E3E3",
          showInLegend: false,
          className: "bar-chart-col",
        },
        {
          name: "",
          data: data,
        },
      ],
    };
  }

  composeMonthlyLineChart(
    categories: any,
    data: any[],
    otherOptions?: any,
  ): any {
    let options: any = {
      chart: {
        type: "spline",
        marginRight: 20,
      },
      title: {
        text: "",
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        style: {
          fontFamily: "var(--proset-font-family)",
          unicodeBidi: "plaintext",
        },
      },
      xAxis: {
        categories: categories,
        labels: {
          style: {
            fontFamily: "var(--proset-font-family)",
          },
        },
      },
      yAxis: {
        title: {
          text: "",
        },
        style: {
          fontFamily: "var(--proset-font-family) !important",
          fontSize: "40px",
          fontWeight: 400,
        },
      },
      series: [
        {
          name: "",
          type: "line",
          data: data,
        },
      ],
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          pointPlacement: "on",
        },
        spline: {
          lineWidth: 4,
          states: {
            hover: {
              lineWidth: 5,
            },
          },
          marker: {
            enabled: false,
          },
          // pointInterval: 3600000, // one hour
        },
      },
    };

    return _.merge({}, options, otherOptions);
  }

  composeSolidGaugeChart(
    series: any,
    subtitle: string,
    legend: boolean = false,
    colors: string[] = [],
  ): any {
    const allColors = colors.length ? colors : ChartsService.pieChartColors;

    return {
      colors: allColors,
      chart: {
        type: "column",
        inverted: true,
        polar: true,
      },
      legend: {
        enabled: legend,
      },
      title: {
        text: "",
      },
      credits: {
        enabled: false,
      },
      subtitle: {
        text: subtitle,
        verticalAlign: "middle",
        floating: true,
        style: {
          fontFamily: "var(--proset-font-family)",
          fontSize: "40px",
          fontWeight: 400,
        },
      },
      tooltip: {
        outside: true,
      },
      pane: {
        size: "85%",
        innerSize: "90%",
        endAngle: 270,
      },
      xAxis: {
        tickInterval: 1,
        lineWidth: 0,
        gridLineWidth: 0,
        labels: { enabled: false },
      },
      yAxis: {
        title: "",
        lineWidth: 0,
        tickInterval: 25,
        reversedStacks: false,
        endOnTick: true,
        showLastLabel: false,
        gridLineWidth: 0,
        labels: { enabled: false },
      },
      plotOptions: {
        column: {
          stacking: "normal",
          borderWidth: 1,
          pointPadding: 0,
          groupPadding: 0.15,
          borderRadius: "50%",
        },
      },
      series: series,
    };
  }
}
