import { Component, Input, OnInit } from "@angular/core";
import { AnyObject, FunctionValue } from "../type";
import * as _ from "lodash";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { NgClass, NgIf } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MatMenuItem } from "@angular/material/menu";

@Component({
  selector: "app-datatable-action",
  templateUrl: "./datatable-action.component.html",
  styleUrls: ["./datatable-action.component.less"],
  standalone: true,
  imports: [NgbTooltip, NgIf, NgClass, TranslateModule, MatMenuItem],
})
export class DatatableActionComponent {
  @Input() id: string | FunctionValue | undefined;
  @Input() row: AnyObject;
  @Input() rows: AnyObject[];
  @Input() icon: string | undefined;
  @Input() button: string;
  @Input() tooltip: string;
  @Input() action: FunctionValue;
  @Input() href: FunctionValue;
  @Input() permission: string[] | undefined;
  @Input() tooltipParams: { [key: string]: string } | undefined;
  @Input() rowIndex: number;
  @Input() editableRows: boolean;

  triggerAction(event: any): void {
    if (!_.isFunction(this.action)) {
      return;
    }
    this.action(this.row, this.rows, event);
  }
}
