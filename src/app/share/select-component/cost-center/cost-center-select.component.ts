import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgSelectComponent, NgSelectConfig } from "@ng-select/ng-select";
import { TranslateService } from "@ngx-translate/core";
import { CostCenter, CostCenterApi } from "@proset/maintenance-client";
import { UserPermissions } from "../../../layouts/menu/enums/menu.enum";

@Component({
  selector: "proset-cost-center-select",
  templateUrl: "./cost-center-select.component.html",
  styleUrls: ["./cost-center-select.component.less"],
})
export class CostCenterSelectComponent implements OnInit {
  @ViewChild("costCenterSelect", { static: false })
  costCenterSelect: NgSelectComponent;
  @Output() costCenterChange = new EventEmitter<CostCenter>();
  @Input() required = false;
  @Input() disabled = false;
  @Input() multiple = false;
  private _value: CostCenter;
  @Input() get value(): CostCenter {
    return this._value;
  }
  set value(costCenter: CostCenter) {
    this.costCenter = costCenter;
    this._value = costCenter;
  }

  costCenter: CostCenter;
  costCenterDtoList: CostCenter[] = [];
  permission = UserPermissions;
  label: string;

  constructor(
    private costCenterApi: CostCenterApi,
    private config: NgSelectConfig,
    private translateService: TranslateService,
    private router: Router,
  ) {
    this.config.notFoundText = this.translateService.instant(
      "GENERAL.NOT_FOUND_MESSAGE",
    );
  }

  ngOnInit(): void {
    this.costCenterApi.getAllCostCenter().subscribe({
      next: (value) => {
        this.costCenterDtoList = value;
      },
    });
  }

  onCostCenterChange(event: CostCenter): void {
    this.costCenter = event;
    this.costCenterChange.emit(event);
  }

  onOpenCostCenterWindow(): void {
    this.router.navigate(["maintenance/base-info/cost-center/list"]);
  }

  onCostCenterSearch(item: any) {
    const searchKey = item.target.value;
    this.costCenterSelect.filter(searchKey);
  }

  searchCostCenter(searchTerm: string, item: CostCenter) {
    return (
      item.name?.includes(searchTerm) ||
      item.code?.toString()?.includes(searchTerm)
    );
  }
}
