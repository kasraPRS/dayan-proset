import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import {
  Asset,
  AssetApi,
  AssetPriority,
  AssetStatus,
  EmplacementLocation,
  EmplacementLocationApi,
  Group,
  GroupApi,
  Level,
  LevelApi,
  Tree,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { Config, FieldType } from "src/app/share/datatable/type";
import { FORM_MODE } from "src/app/share/enums/enums";
import { flattenArray, flattenObject } from "src/app/share/helper/flatten";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { ToastService } from "src/app/share/service/toast.service";
import { SidebarService } from "src/app/share/sidebar-filter/sidebar-service";
import { ASSET_LIST_VIEW_TYPE } from "../enum";

@Component({
  selector: "proset-asset-list",
  templateUrl: "./asset-list.component.html",
  styleUrl: "./asset-list.component.less",
})
export class AssetListComponent implements OnInit {
  searchForm: FormGroup;
  assetList: Asset[] = [];
  config: Config;

  levels: Level[];
  groups: Group[];
  emplacementLocations: EmplacementLocation[];
  statusList: string[] = [];
  priorityList: string[] = [];
  searchParameter: any = {};
  filterNumber: number;

  permission = UserPermissions;

  treeData: Tree;
  listViewType: ASSET_LIST_VIEW_TYPE = ASSET_LIST_VIEW_TYPE.TABLE;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private assetsApi: AssetApi,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
    private translateService: TranslateService,
    private levelApi: LevelApi,
    private groupApi: GroupApi,
    private emplacementLocationApi: EmplacementLocationApi,
    private sidebarService: SidebarService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.createSearchForm();
    this.getAssets();
    this.loadFilterDatas();
    this.config = this.initAssetTable();

    this.assetsApi.getAssetTree().subscribe((res) => {
      this.treeData = res;
    });
  }

  createSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      code: [null],
      level: [null],
      group: [null],
      emplacementLocation: [null],
      priority: [null],
      status: [null],
    });
  }

  getAssets() {
    this.loaderService.setLoading(true);
    const {
      code,
      level,
      group,
      emplacementLocation,
      priority,
      status,
      createdBy,
      updatedBy,
      createdFrom,
      createdTo,
      updatedFrom,
      updatedTo,
    } = this.searchParameter;

    this.assetsApi
      .searchAsset(
        code,
        level,
        group,
        emplacementLocation,
        status,
        priority,
        createdBy,
        updatedBy,
        createdFrom,
        createdTo,
        updatedFrom,
        updatedTo,
      )
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response) => {
        this.assetList = response;
      });
  }

  onDoubleClick(event: Asset) {
    this.router.navigate([
      "maintenance/asset/asset",
      FORM_MODE.VIEW,
      event?.id,
    ]);
  }

  deleteRow(row: Asset) {
    this.dialogService
      .showConfirm({
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .subscribe((response) => {
        if (response && row.id) {
          this.loaderService.setLoading(true);
          this.assetsApi
            .deleteAssetById(row.id)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe({
              next: (response) => {
                this.toastService.success("ASSET.MESSAGES.DELETE");
                this.getAssets();
              },
            });
        }
      });
  }

  onFilterForm(event: any) {
    if (event.isReset) {
      this.searchForm.reset();
      this.filterNumber = 0;
    }
    let formValue = flattenObject(this.searchForm.value);
    this.filterNumber = this.sidebarService.updateFilterList(formValue).length;
    let filter = { ...this.searchForm.value, ...event.value };
    this.onSearchAsset(filter);
  }

  onFilter(): void {
    this.sidebarService.set_sidenavMode(true);
  }

  loadFilterDatas() {
    this.emplacementLocationApi.getAllEmplacementLocation().subscribe({
      next: (response) => {
        this.emplacementLocations = flattenArray(response);
      },
    });

    this.levelApi.getAllLevel().subscribe((res) => {
      this.levels = res;
    });

    this.groupApi.getAllGroup().subscribe((res) => {
      this.groups = res;
    });

    this.statusList = Object.keys(AssetStatus);
    this.priorityList = Object.keys(AssetPriority);
  }

  onSearchInList(event: any, list: any) {
    const searchTerm = event.target.value;
    list = list.filter((item: any) => {
      return item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  onSearchAsset(event: any) {
    this.searchParameter =
      flattenObject({
        code: this.searchForm.get("code")?.value,
        level: this.searchForm.get("level")?.value,
        group: this.searchForm.get("group")?.value,
        emplacementLocation: this.searchForm.get("emplacementLocation")?.value,
        status: this.searchForm.get("status")?.value,
        priority: this.searchForm.get("priority")?.value,
        ...event,
      }) || {};

    this.getAssets();
  }

  onAssetInfoChange(asset: any) {
    const value = (asset as Asset[]).map((m) => m.uuid);
    this.searchForm.get("asstInformationList")?.setValue(value);
  }

  onEmplacmentLocationChange(asset: any) {
    const value = (asset as Asset[]).map((m) => m.uuid);
    this.searchForm.get("emplacementLocationList")?.setValue(value);
  }

  onCostCenterChange(asset: any) {
    const value = (asset as Asset[]).map((m) => m.uuid);
    this.searchForm.get("costCenterList")?.setValue(value);
  }

  updateRow(row: Asset) {
    this.router.navigate(["maintenance/asset/asset", FORM_MODE.UPDATE, row.id]);
  }

  initAssetTable(): Config {
    return {
      id: "ASSET_TABLE",
      limitPerPage: 0,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      list: [
        {
          type: FieldType.text,
          id: "ASSET_TITLE",
          label: "ASSET.TABLE.ASSET_TITLE",
          field: "name",
          minWidth: 50,
          width: 105,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "NUMBER_PLATE",
          label: "ASSET.TABLE.NUMBER_PLATE",
          field: "code",
          minWidth: 50,
          width: 102,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "PARENT",
          label: "ASSET.TABLE.PARENT",
          field: "parent.name",
          minWidth: 50,
          width: 102,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "LEVEL",
          label: "ASSET.TABLE.LEVEL",
          field: "group.level.name",
          minWidth: 50,
          width: 104,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GROUP",
          label: "ASSET.TABLE.GROUP",
          field: "group.name",
          minWidth: 50,
          width: 131,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "EMPLACEMENT_LOCATION",
          label: "ASSET.TABLE.EMPLACEMENT_LOCATION",
          field: "emplacementLocation.name",
          minWidth: 50,
          width: 122,
          sortable: false,
        },
        {
          type: FieldType.date,
          id: "UTILIZATION_DATE",
          label: "ASSET.TABLE.UTILIZATION_DATE",
          field: "utilizationDate",
          minWidth: 50,
          width: 114,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ASSET_PRIORITY",
          label: "ASSET.TABLE.ASSET_PRIORITY",
          field: "priority",
          minWidth: 50,
          width: 50,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("ASSET.FORM.PRIORITY." + value)
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "ASSET_STATUS",
          label: "ASSET.TABLE.ASSET_STATUS",
          field: "status",
          minWidth: 50,
          width: 50,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("ASSET.FORM.STATUS." + value)
              : "-";
          },
        },
        {
          type: FieldType.text,
          id: "DAILY_USAGE_DURATION",
          label: "ASSET.TABLE.DAILY_USAGE_DURATION",
          field: "",
          minWidth: 50,
          width: 119,
          sortable: false,
          translator: (value) => {
            let strTime = "";

            if (value.dailyUsageDurationHour) {
              strTime = String(value.dailyUsageDurationHour).concat(
                " ",
                this.translateService.instant("GENERAL.HOUR"),
              );

              if (value.dailyUsageDurationMinute)
                strTime = strTime.concat(
                  " " + this.translateService.instant("GENERAL.AND") + " ",
                );
            }

            if (value.dailyUsageDurationMinute)
              strTime = strTime.concat(
                String(value.dailyUsageDurationMinute).concat(
                  " ",
                  this.translateService.instant("GENERAL.MINUTE"),
                ),
              );

            return strTime;
          },
        },
        {
          type: FieldType.text,
          id: "DESCRIPTION",
          label: "ASSET.TABLE.DESCRIPTION",
          field: "description",
          minWidth: 50,
          width: 206,
          sortable: false,
        },
        {
          type: FieldType.date,
          id: "GENERAL_CREATED",
          label: "DATATABLE.CREATED",
          field: "created",
          minWidth: 50,
          width: 100,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GENERAL.CREATED_BY",
          label: "DATATABLE.CREATED_BY",
          field: "createdByName",
          minWidth: 50,
          width: 122,
          sortable: false,
        },
        {
          type: FieldType.date,
          id: "GENERAL_UPDATED",
          label: "DATATABLE.UPDATED",
          field: "updated",
          minWidth: 50,
          width: 152,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GENERAL_UPDATED",
          label: "DATATABLE.UPDATED_BY",
          field: "updatedByName",
          minWidth: 50,
          width: 142,
          sortable: false,
        },
      ],
      actions: [
        {
          id: "ASSET_EDIT",
          icon: "isax isax-edit-2",
          tooltip: "DATATABLE.EDIT",
          permission: [UserPermissions.ASSET, UserPermissions.ASSET_UPDATE],
          label: "DATATABLE.EDIT",
          action: (row): void => this.updateRow(row),
        },
        {
          id: "ASSET_DELETE",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          permission: [UserPermissions.ASSET, UserPermissions.ASSET_DELETE],
          label: "DATATABLE.DELETE",
          action: (row): void => this.deleteRow(row),
        },
      ],
    };
  }

  get ASSET_LIST_VIEW_TYPE() {
    return ASSET_LIST_VIEW_TYPE;
  }
}
