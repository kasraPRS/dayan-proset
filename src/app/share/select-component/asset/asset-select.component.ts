import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Asset, AssetApi, AssetInfo } from "@proset/maintenance-client";
import * as _ from "lodash";
import { UserPermissions } from "../../../layouts/menu/enums/menu.enum";
import { NgSelectComponent } from "@ng-select/ng-select";

@Component({
  selector: "proset-asset-select",
  templateUrl: "./asset-select.component.html",
  styleUrls: ["./asset-select.component.less"],
})
export class AssetSelectComponent implements OnInit, OnChanges {
  @Output() assetChange = new EventEmitter<AssetInfo | AssetInfo[]>();
  @Input() required = false;
  @Input() disabled = false;
  @Input() multiple = false;
  @Input() appendTo: any;
  @Input() value: AssetInfo[] | AssetInfo;
  @ViewChild("selectAsset", { static: false })
  selectAsset: NgSelectComponent;
  formGroup: FormGroup;

  assetDtoList: AssetInfo[] = [];
  permission = UserPermissions;
  label: string;

  constructor(
    private _assetApi: AssetApi,
    private formBuilder: FormBuilder,
  ) {
    this.formGroup = this.formBuilder.group({
      asset: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formGroup.get("asset")?.setValue(this.value);
  }

  onAssetSearch(item: any) {
    const searchKey = item.target.value;
    this.selectAsset.filter(searchKey);
  }

  ngOnInit(): void {
    this._assetApi
      .getAllUsableAsset()
      .subscribe((assetInfoList) => (this.assetDtoList = assetInfoList));
  }

  onAssetChange(event: AssetInfo, selectAsset: any): void {
    const assetField = this.formGroup.get("asset");
    const val = this.multiple
      ? this.getUniqeSelectedList(assetField?.value)
      : event;

    assetField?.setValue(val);
    this.assetChange.emit(val);
    selectAsset.close();
  }

  getUniqeSelectedList(items: AssetInfo[]) {
    return _.uniqBy(items, (obj) => obj);
  }

  goToNewAsset() {
    window.open("maintenance/asset/asset/form");
  }
  searchAsset(searchTerm: string, item: Asset) {
    return item.name?.includes(searchTerm) || item.id?.toString() == searchTerm;
  }
}
