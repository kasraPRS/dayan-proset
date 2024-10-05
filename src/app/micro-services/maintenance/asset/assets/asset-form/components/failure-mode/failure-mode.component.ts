import { Component, Input, OnInit } from "@angular/core";
import { FailureMode } from "@proset/maintenance-client";
import { Config, FieldType } from "src/app/share/datatable/type";
import { ShareService } from "src/app/share/service/share.service";

@Component({
  selector: "proset-asset-failure-mode",
  templateUrl: "./failure-mode.component.html",
  styleUrl: "./failure-mode.component.less",
})
export class AssetFailureModeListComponent implements OnInit {
  config: Config;
  @Input() tableRow: FailureMode[] = [];

  ngOnInit(): void {
    this.config = this.initFailureModeTable();
    this.getAllFailureMode();
  }

  constructor(private shareService: ShareService) {}

  getAllFailureMode(): void {}

  initFailureModeTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "FailureMode_Table",
      list: [
        {
          type: FieldType.text,
          id: "FAILURE_MODE_TABLE_CODE",
          label: "FAILURE_MODE.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAILURE_MODE_TABLE_NAME",
          label: "FAILURE_MODE.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 113,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "FAILURE_MODE_TABLE_DESCRIPTION",
          label: "FAILURE_MODE.TABLE.DESCRIPTION",
          field: "description",
          minWidth: 50,
          width: 110,
          sortable: false,
        },
      ],
    };
  }
}
