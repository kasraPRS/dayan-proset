import { Component, OnInit, ViewChild } from "@angular/core";
import { ErrorLog, ErrorLogApi } from "@proset/maintenance-client";
import { DatatableComponent } from "../../../../share/datatable/datatable.component";
import { NgIf } from "@angular/common";
import { Config, FieldType } from "../../../../share/datatable/type";
import { ShareService } from "../../../../share/service/share.service";
import { LoaderService } from "../../../../share/service/loader.service";
import { finalize } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import * as _ from "lodash";

@Component({
  selector: "proset-error-log",
  standalone: true,
  imports: [DatatableComponent, NgIf, TranslateModule],
  templateUrl: "./error-log.component.html",
  styleUrl: "./error-log.component.less",
})
export class ErrorLogComponent implements OnInit {
  config: Config;
  tableRow: ErrorLog[] = [];
  @ViewChild(DatatableComponent) logTable: DatatableComponent;

  constructor(
    private errorLogApi: ErrorLogApi,
    private shareService: ShareService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loaderService.setLoading(true);
    this.config = this.initErrorLogTable();
    this.getAllErrorLog();
  }

  getAllErrorLog() {
    this.errorLogApi
      .getAllErrorLogs()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => {
        this.tableRow = [...response];
      });
  }
  initErrorLogTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Person_Table",
      list: [
        {
          type: FieldType.text,
          id: "EVENTS_CODE",
          label: "EVENTS.CODE",
          field: "errorCode",
          minWidth: 50,
          width: 10,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "EVENTS_MESSAGE",
          label: "EVENTS.MESSAGE",
          field: "errorMessage",
          minWidth: 50,
          width: 400,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "EVENTS_ERROR_TIME",
          label: "EVENTS.ERROR_TIME",
          field: "errorTime",
          minWidth: 50,
          width: 10,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDateTime(value) : " - ";
          },
        },
      ],
      actions: [],
    };
  }

  //TODO: should be implement
  updateFilter(event: any) {
    const phrase = event.target.value.toLowerCase();
    if (phrase || phrase === null || phrase === "") {
      this.getAllErrorLog();
    }
    const temp = _.filter(this.tableRow, (log: ErrorLog) => {
      return log.errorCode?.toLowerCase().indexOf(phrase) !== -1 || !phrase;
    });
    this.tableRow = temp;
  }
}
