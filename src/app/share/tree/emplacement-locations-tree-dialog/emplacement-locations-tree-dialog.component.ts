import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import {
  EmplacementLocationApi,
  EmplacementLocation,
} from "@proset/maintenance-client";
import { GenericTreeComponent } from "../generic-tree/generic-tree.component";
import { MatButtonModule } from "@angular/material/button";

interface EmplacementLocationNode extends EmplacementLocation {
  children?: EmplacementLocationNode[];
  parent_id?: number;
}

@Component({
  selector: "app-emplacement-locations-tree-dialog",
  templateUrl: "./emplacement-locations-tree-dialog.component.html",
  styleUrls: ["./emplacement-locations-tree-dialog.component.less"],
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
export class EmplacementLocationTreeDialogComponent implements OnInit {
  selectedEmplacementLocations: EmplacementLocation[] = [];
  treeData: EmplacementLocationNode[] = [];
  selectedIds: any[] = [];
  multiple: boolean;
  emplacementLocationId: number;

  onSelectionChange(emplacementLocations: EmplacementLocation[]) {
    this.selectedEmplacementLocations = emplacementLocations;
  }

  constructor(
    private dialogRef: MatDialogRef<EmplacementLocationTreeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      emplacementLocationId: number;
      multiple: boolean;
      initialSelection: EmplacementLocation[];
    },
    private emplacementLocationApi: EmplacementLocationApi,
  ) {
    this.emplacementLocationId = data.emplacementLocationId;
    this.multiple = data.multiple;
    this.selectedEmplacementLocations = [...this.data.initialSelection];
  }

  ngOnInit() {
    this.loadEmplacementLocations();

    this.selectedIds =
      this.selectedEmplacementLocations.map(
        (emplacementLocation) => emplacementLocation.id,
      ) || [];
  }

  loadEmplacementLocations() {
    this.emplacementLocationApi
      .getAllEmplacementLocation()
      .subscribe((emplacementLocations) => {
        this.treeData = emplacementLocations;
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.dialogRef.close(this.selectedEmplacementLocations);
  }
}
