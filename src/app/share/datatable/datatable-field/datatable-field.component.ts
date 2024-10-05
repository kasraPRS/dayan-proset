import { Component, Input, OnInit } from "@angular/core";
import { FieldType } from "../type";
import { ShareService } from "../../service/share.service";
import * as _ from "lodash";
import { DecimalPipe, NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-datatable-field",
  templateUrl: "./datatable-field.component.html",
  styleUrls: ["./datatable-field.component.less"],
  standalone: true,
  imports: [
    NgSwitch,
    NgbTooltip,
    TranslateModule,
    DecimalPipe,
    NgSwitchCase,
    NgIf,
  ],
})
export class DatatableFieldComponent implements OnInit {
  @Input() column: any;
  @Input() type = "text";
  @Input() entry: any;
  @Input() value: any;
  @Input() searchTerm: string;
  @Input() tooltip: string;
  @Input() commaSeperatedToolTipFieldName: string;
  @Input() url: string;
  public fieldType = FieldType;

  constructor(
    private _shareService: ShareService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.commaSeperatedToolTipFieldName) {
      this.tooltip = _.map(
        this.value,
        this.commaSeperatedToolTipFieldName,
      ).join(" , ");
    }
  }

  getValue(): any {
    return this.computeValue(this.column, this.value, this.entry || {}) ?? "-";
  }

  computeValue(config: any, value: any, row: any): any {
    if (typeof config.translator === "function") {
      if (typeof config.translate === "string" && typeof value === "string") {
        value = config.translate + "." + value;
      }
      value = config.translator(value, row, config);
    }
    return value;
  }

  //TODO: it should be clarify with PO side. Q: pattern for tooltip and show text , when text is too long
  getTextValue(): string {
    let string =
      this.computeValue(this.column, this.value, this.entry || {}) ?? undefined;
    if (string && string.length > 15) {
      return string.substring(0, 15) + "...";
    }
    return string;
  }

  getDateValue() {
    return this.value ? this._shareService.getJalaliDate(this.value) : "-";
  }

  redirectToLink() {
    window.open(this.url + "/" + this.value);
  }
}
