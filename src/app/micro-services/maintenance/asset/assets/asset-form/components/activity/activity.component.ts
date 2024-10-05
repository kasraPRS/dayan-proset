import { Component, Input, OnInit } from "@angular/core";
import { Activity } from "@proset/maintenance-client";
import { Config, FieldType } from "src/app/share/datatable/type";

@Component({
  selector: "proset-asset-activity",
  templateUrl: "./activity.component.html",
  styleUrl: "./activity.component.less",
})
export class AssetActivityListComponent implements OnInit {
  config: Config;
  @Input() tableRow: Activity[] = [];

  ngOnInit(): void {
    this.config = this.initActivityTable();
  }

  initActivityTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Activity_Table",
      list: [
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "ACTIVITY.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_NAME",
          label: "ACTIVITY.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
      ],
    };
  }
}
