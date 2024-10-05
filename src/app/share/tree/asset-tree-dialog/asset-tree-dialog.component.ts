import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { AssetApi, AssetInfo } from "@proset/maintenance-client";
import { GenericTreeComponent } from "../generic-tree/generic-tree.component";
import { MatButtonModule } from "@angular/material/button";

interface AssetNode extends AssetInfo {
  children?: AssetNode[];
  parent_id?: number;
}

@Component({
  selector: "app-asset-tree-dialog",
  templateUrl: "./asset-tree-dialog.component.html",
  styleUrls: ["./asset-tree-dialog.component.less"],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    GenericTreeComponent,
  ],
})
export class AssetTreeDialogComponent implements OnInit {
  selectedAssets: AssetInfo[] = [];
  treeData: AssetNode[] = [];
  selectedIds: any[] = [];
  multiple: boolean;
  assetId: number;

  onSelectionChange(assets: AssetInfo[]) {
    this.selectedAssets = assets;
  }

  constructor(
    private dialogRef: MatDialogRef<AssetTreeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      assetId: number;
      multiple: boolean;
      initialSelection: AssetInfo[];
    },
    private assetApi: AssetApi,
  ) {
    this.assetId = data.assetId;
    this.multiple = data.multiple;
    this.selectedAssets = [...this.data.initialSelection];
  }

  ngOnInit() {
    this.loadAssets();

    this.selectedIds = this.selectedAssets.map((asset) => asset.id) || [];
  }

  loadAssets() {
    this.assetApi.getParent(this.assetId).subscribe((assets) => {
      this.treeData = assets;
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.dialogRef.close(
      this.selectedAssets.map((asset: any) => {
        const { children, expandable, level, ...rest } = asset;
        return rest;
      }),
    );
  }
}
