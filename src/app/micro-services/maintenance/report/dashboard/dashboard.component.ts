// dashboard.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import * as moment from "jalali-moment";

@Component({
  selector: "proset-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.less"],
})
export class DashboardComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.createForm();
  }

  form: FormGroup;

  reportTabs = [
    "REPORT.TABS.WORK_ORDER",
    "REPORT.TABS.REQUEST",
    "REPORT.TABS.ASSET",
    "REPORT.TABS.PARTS",
  ];
  activeTabIndex = 0;

  createForm() {
    const fromDate = moment();
    this.form = this.formBuilder.group({
      fromDate: [fromDate.clone().subtract(1, "jMonth").format("YYYY-MM-DD")],
      toDate: [fromDate.format("YYYY-MM-DD")],
    });
    this.form.get("fromDate")?.valueChanges.subscribe(() => {
      this.form.get("toDate")?.reset();
    });
  }
}
