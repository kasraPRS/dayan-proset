import { Component, Input, OnInit } from "@angular/core";
import { Config, FieldType } from "src/app/share/datatable/type";

@Component({
  selector: "proset-asset-document",
  templateUrl: "./document.component.html",
  styleUrl: "./document.component.less",
})
export class AssetDocumentListComponent implements OnInit {
  config: Config;
  @Input() tableRow: any[] = [];

  ngOnInit(): void {
    this.config = this.initDocumentTable();
  }
  initDocumentTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Document_Table",
      list: [
        {
          type: FieldType.text,
          id: "DOCUMENT_TABLE_NAME",
          label: "ASSET.FORM.DOCUMENT.NAME",
          field: "name",
          minWidth: 50,
          width: 400,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "DOCUMENT_TABLE_SIZE",
          label: "ASSET.FORM.DOCUMENT.SIZE",
          field: "size",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.price,
          id: "DOCUMENT_TABLE_DOWNLOAD",
          label: "ASSET.FORM.DOCUMENT.DOWNLOAD",
          field: "url",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
      ],
    };
  }
}
