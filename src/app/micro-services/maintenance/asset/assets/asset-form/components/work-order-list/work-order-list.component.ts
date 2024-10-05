import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { WorkOrderRelatedAsset } from "@proset/maintenance-client";
import { Config, FieldType } from "src/app/share/datatable/type";
import { ShareService } from "src/app/share/service/share.service";

@Component({
  selector: "proset-asset-work-order-list",
  templateUrl: "./work-order-list.component.html",
  styleUrl: "./work-order-list.component.less",
})
export class AssetWorkOrderListComponent {
  config: Config;
  @Input() tableRow: WorkOrderRelatedAsset[] = [];

  constructor(
    private translateService: TranslateService,
    private shareService: ShareService,
  ) {}

  ngOnInit(): void {
    this.config = this.initWorkOrderTable();
  }

  initWorkOrderTable(): Config {
    return {
      id: "WORK_ORDERS",
      limitPerPage: 0,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      list: [
        {
          type: FieldType.url,
          id: "WORK_ORDERS_NUMBER",
          label: "ASSET.FORM.WORK_ORDER.NUMBER",
          field: "code",
          minWidth: 50,
          width: 100,
          sortable: false,
          url: "/maintenance/maintenance/work-order/request/view/:code",
        },
        {
          type: FieldType.text,
          id: "ORDER_TYPE",
          label: "ASSET.FORM.WORK_ORDER.TYPE",
          field: "type",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant(
                  "WORK_ORDERS.WORK_ORDER_TYPE." + value,
                )
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "ASSET_STATUS",
          label: "ASSET.FORM.WORK_ORDER.STATUS",
          field: "status",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("WORK_ORDERS.STATUS." + value)
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "GENERAL_CREATED",
          label: "DATATABLE.CREATED",
          field: "created",
          minWidth: 50,
          width: 150,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "START_DATE",
          label: "ASSET.FORM.WORK_ORDER.START_DATE",
          field: "startDate",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "END_DATE",
          label: "ASSET.FORM.WORK_ORDER.END_DATE",
          field: "endDate",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "WORK_ORDERS_WORKING_HOUR",
          label: "ASSET.FORM.WORK_ORDER.WORKING_HOUR",
          field: "workingHour",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.price,
          id: "WORK_ORDERS_WORKING_COST",
          label: "ASSET.FORM.WORK_ORDER.WORKING_COST",
          field: "workingCost",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "WORK_ORDERS_OVERTIME_HOUR",
          label: "ASSET.FORM.WORK_ORDER.OVERTIME_HOUR",
          field: "overTimeHour",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.price,
          id: "WORK_ORDERS_OVERTIME_COST",
          label: "ASSET.FORM.WORK_ORDER.OVERTIME_COST",
          field: "overTimeCost",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.price,
          id: "WORK_ORDERS_SUM_HOUR",
          label: "ASSET.FORM.WORK_ORDER.SUM_HOUR",
          field: "sumHour",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
        {
          type: FieldType.price,
          id: "WORK_ORDERS_SUM_COST",
          label: "ASSET.FORM.WORK_ORDER.SUM_COST",
          field: "sumCost",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
      ],
    };
  }
}
