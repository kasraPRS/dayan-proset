import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { WorkRequest } from "@proset/maintenance-client";
import { Config, FieldType } from "src/app/share/datatable/type";
import { ShareService } from "src/app/share/service/share.service";

@Component({
  selector: "proset-asset-request-list",
  templateUrl: "./request-list.component.html",
  styleUrl: "./request-list.component.less",
})
export class AssetRequestListComponent {
  config: Config;
  @Input() tableRow: WorkRequest[] = [];

  constructor(
    private translateService: TranslateService,
    private shareService: ShareService,
  ) {}
  ngOnInit(): void {
    this.config = this.initRquestTable();
  }

  initRquestTable(): Config {
    return {
      id: "REQUEST_TABLE",
      limitPerPage: 0,
      pagination: true,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      list: [
        {
          type: FieldType.url,
          id: "NUMBER",
          label: "ASSET.FORM.WORK_REQUEST.NUMBER",
          field: "code",
          minWidth: 50,
          width: 50,
          sortable: false,
          url: "/maintenance/maintenance/request/view/code",
        },
        {
          type: FieldType.text,
          id: "STATUS",
          label: "ASSET.FORM.WORK_REQUEST.STATUS",
          field: "status",
          minWidth: 100,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("REQUEST.STATUS." + value)
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "REQUESTER",
          label: "ASSET.FORM.WORK_REQUEST.REQUESTER",
          field: "applicant.name",
          minWidth: 100,
          width: 150,
          sortable: false,
        },
      ],
    };
  }
}
