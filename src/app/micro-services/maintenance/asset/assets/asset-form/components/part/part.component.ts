import { Component, Input, OnInit } from "@angular/core";
import { PartRelatedToAsset } from "@proset/maintenance-client";
import { Config, FieldType } from "src/app/share/datatable/type";

@Component({
  selector: "proset-asset-part",
  templateUrl: "./part.component.html",
  styleUrl: "./part.component.less",
})
export class AssetPartListComponent implements OnInit {
  config: Config;
  @Input() tableRow: PartRelatedToAsset[] = [];

  ngOnInit(): void {
    this.config = this.initPartTable();
  }
  initPartTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Part_Table",
      list: [
        {
          type: FieldType.text,
          id: "PART_TABLE_NAME",
          label: "ASSET.FORM.PART.NAME",
          field: "part.name",
          minWidth: 50,
          width: 113,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PART_TABLE_CODE",
          label: "ASSET.FORM.PART.CODE",
          field: "part.code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PART_TABLE_WORKORDER_CODE",
          label: "ASSET.FORM.PART.WORKORDER_CODE",
          field: "workOrderCode",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PART_TABLE_COUNT",
          label: "ASSET.FORM.PART.COUNT",
          field: "part.count",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PART_TABLE_UNIT_PRICE",
          label: "ASSET.FORM.PART.UNIT_PRICE",
          field: "unitPrice",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PART_TABLE_COST",
          label: "ASSET.FORM.PART.COST",
          field: "cost",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
      ],
    };
  }
}
