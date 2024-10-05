import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { ReportType } from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { Config } from "src/app/share/datatable/type";
import { ListDataService } from "../service/list-data.service";

@Component({
  selector: "proset-report-list-view",
  templateUrl: "./report-list-view.component.html",
  styleUrl: "./report-list-view.component.less",
})
export class ReportListViewComponent implements OnInit {
  @Input() listTitle: string;
  @Input({ required: true }) config: Config;

  @Input({ required: true }) reportType: ReportType;
  @Input({ required: true }) fromDate: string;
  @Input({ required: true }) toDate: string;

  list: any[];
  loading = true;

  constructor(private listDataService: ListDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes["reportType"]?.currentValue !=
        changes["reportType"]?.previousValue ||
        changes["fromDate"]?.currentValue !=
          changes["fromDate"]?.previousValue ||
        changes["toDate"]?.currentValue != changes["toDate"]?.previousValue) &&
      !changes["reportType"]?.firstChange
    ) {
      this.loadDate();
    }
  }

  ngOnInit(): void {
    this.loadDate();
  }

  loadDate() {
    if (this.fromDate && this.toDate) {
      this.loading = true;
      this.listDataService
        .loadListData(this.reportType, this.fromDate, this.toDate)
        .pipe(
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe((res) => {
          this.list = res;
        });
    }
  }
}
