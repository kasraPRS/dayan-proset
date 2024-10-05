import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AssetApi, AssetResponse } from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { FORM_MODE } from "src/app/share/enums/enums";
import { LoaderService } from "src/app/share/service/loader.service";
import { ProsetDialogService } from "src/app/share/service/proset-dialog.service";
import { ToastService } from "src/app/share/service/toast.service";
import { AssetCalculateDepreciationService } from "./asset.calculate-depreciation.service";
import { AssetStateService } from "./asset.state.service";
import * as _ from "lodash";
import { UserPermissions } from "../../../../../layouts/menu/enums/menu.enum";

@Component({
  selector: "proset-asset-form",
  templateUrl: "./asset-form.component.html",
  styleUrl: "./asset-form.component.less",
})
export class AssetFormComponent implements OnInit {
  @Input() assetId: number | undefined;
  @Input() viewType: FORM_MODE = FORM_MODE.CREATE;

  permissions = UserPermissions;
  assetDto: AssetResponse = {};
  permission = UserPermissions;

  constructor(
    private router: Router,
    private dialogService: ProsetDialogService,
    private loaderService: LoaderService,
    private assetApi: AssetApi,
    private toastService: ToastService,
    public assetStateService: AssetStateService,
    private assetCalculateDepreciationService: AssetCalculateDepreciationService,
  ) {}

  ngOnInit() {
    this.assetStateService.setViewType(this.viewType);
    this.assetStateService.clearAsset();
    if (this.assetId) {
      this.getAssetsView();
    }
  }

  /**
   * Retrieves the assets view if the assetId is provided.
   *
   * @returns void
   */
  getAssetsView() {
    if (this.assetId) {
      this.loaderService.setLoading(true);
      this.assetApi
        .getAssetById(this.assetId)
        .pipe(
          finalize(() => {
            this.loaderService.setLoading(false);
          }),
        )
        .subscribe((res: any) => {
          this.assetDto = res;
          this.assetStateService.setAsset(this.assetDto);
        });
    }
  }

  public saveAsset() {
    this.loaderService.setLoading(true);

    this.assetDto = Object.assign(
      {},
      this.assetDto,
      this.assetStateService.getFormValues(),
    );

    this.assetDto.depreciationCalculationList =
      this.assetCalculateDepreciationService.init(this.assetDto, true);

    if (this.assetId)
      this.assetApi
        .updateAssetById(this.assetId, this.assetDto)
        .pipe(
          finalize(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.loaderService.setLoading(false);
          }),
        )
        .subscribe({
          next: () => {
            this.toastService.success("ASSET.MESSAGES.UPDATE");
            this.router.navigate(["maintenance/asset/asset/list"]);
          },
          error: () => {
            this.toastService.error("ASSET.MESSAGES.INSERT_FAIL");
          },
        });
    else
      this.assetApi
        .createAsset(this.assetDto)
        .pipe(
          finalize(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.loaderService.setLoading(false);
          }),
        )
        .subscribe({
          next: (res) => {
            this.assetId = res.id;
            this.toastService.success("ASSET.MESSAGES.INSERT");
            this.router.navigate(["maintenance/asset/asset/list"]);
          },
          error: () => {
            this.toastService.error("ASSET.MESSAGES.INSERT_FAIL");
          },
        });
  }

  goToList() {
    this.dialogService
      .showConfirm({
        title: "ASSET.MESSAGES.BACK_TO_LIST_TITLE",
        contentMessage: "ASSET.MESSAGES.BACK_TO_LIST",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.router.navigate(["maintenance/asset/asset/list"]);
        }
      });
  }

  get viewMode(): boolean {
    return this.assetStateService.getViewMode();
  }
}
