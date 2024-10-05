import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import {
  AssetApi,
  Tree,
  TreeAsset,
  TreeGroup,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { ExportService } from "src/app/share/datatable/export.service";
import { LoaderService } from "src/app/share/service/loader.service";

@Component({
  selector: "proset-tree-column",
  templateUrl: "./tree-column.component.html",
  styleUrl: "./tree-column.component.less",
  animations: [
    trigger("listAnimation", [
      transition("* => *", [
        query(
          ":enter",
          [
            style({ opacity: 0, transform: "translateY(20px)" }),
            stagger(50, [
              animate(
                "300ms ease-out",
                style({ opacity: 1, transform: "translateY(0)" }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class TreeColumnComponent {
  @Input() treeData!: Tree;

  selectedLevel: number | null = null;
  selectedGroup: number | null = null;
  selectedAssets: TreeAsset[] = [];
  assetTree: { [key: string]: TreeAsset[] } = {};
  rootAssets: TreeAsset[] = [];
  allAssets: TreeAsset[] = [];
  columns: TreeAsset[][] = [];

  constructor(
    private router: Router,
    private assetApi: AssetApi,
    private exportService: ExportService,
    private loaderService: LoaderService,
  ) {}

  selectLevel(index: number) {
    if (this.selectedLevel != null) this.selectedLevel = null;
    else this.selectedLevel = index;

    this.selectedGroup = null;
    this.assetTree = {};
    this.allAssets = [];
    this.rootAssets = [];
    this.columns = [];
  }

  selectGroup(index: number) {
    if (this.selectedGroup != null) {
      this.selectedGroup = null;
      this.allAssets = [];
    } else {
      this.selectedGroup = index;
      this.allAssets = this.getSelectedAssets();
    }
    this.initializeColumns();
  }

  getGroupsForSelectedLevel(): TreeGroup[] {
    if (
      this.selectedLevel !== null &&
      this.treeData &&
      this.treeData.treeLevelList
    ) {
      const selectedLevel = this.treeData.treeLevelList[this.selectedLevel];
      return selectedLevel && selectedLevel.treeGroupList
        ? selectedLevel.treeGroupList
        : [];
    }
    return [];
  }

  getSelectedAssets(): TreeAsset[] {
    if (this.selectedLevel !== null && this.selectedGroup !== null) {
      return (
        this.treeData?.treeLevelList
          ?.at(this.selectedLevel)
          ?.treeGroupList?.at(this.selectedGroup)?.assetList || []
      );
    }
    return [];
  }

  initializeColumns() {
    const rootAssets = this.allAssets.filter(
      (asset) => asset.parentId === null,
    );
    this.columns = [rootAssets];
    this.selectedAssets = [];
  }

  selectAsset(asset: TreeAsset, columnIndex: number) {
    if (this.columns.length - 1 == columnIndex + 1) {
      this.columns.pop();
    } else {
      this.columns = this.columns.slice(0, columnIndex + 1);
      this.selectedAssets = this.selectedAssets.slice(0, columnIndex);

      this.selectedAssets[columnIndex] = asset;

      const children = this.allAssets.filter((a) => a.parentId === asset.id);
      if (children.length > 0) {
        this.columns.push(children);
      }
    }
  }

  isAssetSelected(asset: TreeAsset, columnIndex: number): boolean {
    return this.selectedAssets[columnIndex]?.id === asset.id;
  }

  hasChildren(asset: TreeAsset): boolean {
    return this.allAssets.some((a) => a.parentId === asset.id);
  }

  isLevelSelected(index: number): boolean {
    return this.selectedLevel === index;
  }

  isGroupSelected(index: number): boolean {
    return this.selectedGroup === index;
  }

  onExportExcel() {
    this.loaderService.setLoading(true);
    this.assetApi
      .getAllAsset()
      .pipe(
        finalize(() => {
          this.loaderService.setLoading(false);
        }),
      )
      .subscribe((assets) => {
        let rows = assets || [];
        const excelFileName: string = "assets_" + new Date().toISOString();
        this.exportService.exportToExcel(excelFileName, rows, {});
      });
  }

  goNewAsset() {
    this.router.navigateByUrl("/maintenance/asset/asset/form");
  }
}
