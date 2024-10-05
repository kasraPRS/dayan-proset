import { Component, Input, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CostRelatedToAsset } from "@proset/maintenance-client";
import { Config, FieldType } from "src/app/share/datatable/type";

@Component({
  selector: "proset-asset-cost",
  templateUrl: "./cost.component.html",
  styleUrl: "./cost.component.less",
})
export class AssetCostListComponent implements OnInit {
  config: Config;
  @Input() cost: CostRelatedToAsset;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.config = this.initCostTable();
  }

  initCostTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Cost_Table",
      list: [
        {
          type: FieldType.text,
          id: "COST_TABLE_NAME",
          label: "ASSET.FORM.COST.WORKINGHOUR",
          field: "workingHour",
          minWidth: 50,
          width: 113,
          sortable: false,
          translator: (value, row: CostRelatedToAsset) => {
            return this.formatHourMinute(row.workingHour, row.workingMinute);
          },
        },
        {
          type: FieldType.text,
          id: "COST_TABLE_OVERTIMEHOUR",
          label: "ASSET.FORM.COST.OVERTIMEHOUR",
          field: "overTimeHour",
          minWidth: 50,
          width: 94,
          sortable: false,
          translator: (value, row: CostRelatedToAsset) => {
            return this.formatHourMinute(row.overTimeHour, row.overTimeMinute);
          },
        },
        {
          type: FieldType.price,
          id: "COST_TABLE_PERSONNELCOST",
          label: "ASSET.FORM.COST.PERSONNELCOST",
          field: "personnelCost",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "COST_TABLE_CONTRACTORWORKINGHOUR",
          label: "ASSET.FORM.COST.CONTRACTORWORKINGHOUR",
          field: "contractorWorkingHour",
          minWidth: 50,
          width: 94,
          sortable: false,
          translator: (value, row: CostRelatedToAsset) => {
            return this.formatHourMinute(
              row.contractorWorkingHour,
              row.contractorWorkingMinute,
            );
          },
        },
        {
          type: FieldType.price,
          id: "COST_TABLE_CONTRACTORCOST",
          label: "ASSET.FORM.COST.CONTRACTORCOST",
          field: "contractorCost",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.price,
          id: "COST_TABLE_PARTSCOST",
          label: "ASSET.FORM.COST.PARTSCOST",
          field: "partsCost",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.price,
          id: "COST_TABLE_SUMCOST",
          label: "ASSET.FORM.COST.SUMCOST",
          field: "sumCost",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
      ],
    };
  }
  formatHourMinute(hour: any, minute: any) {
    const hourText =
      Number(hour) > 0
        ? hour + " " + this.translateService.instant("GENERAL.HOUR")
        : "";
    const minuteText = Number(minute)
      ? minute + " " + this.translateService.instant("GENERAL.MINUTE")
      : "";

    return hourText || minuteText ? hourText.concat(minuteText) : "-";
  }
}
