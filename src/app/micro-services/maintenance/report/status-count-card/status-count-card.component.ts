import { Component, Input } from "@angular/core";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";

@Component({
  selector: "proset-status-card",

  templateUrl: "./status-count-card.component.html",
  styleUrl: "./status-count-card.component.less",
})
export class StatusCountCardComponent {
  @Input() cardTitle!: string;
  @Input() value!: number;
  @Input() color!: string;
  @Input() loading = false;
  permission = UserPermissions;
}
