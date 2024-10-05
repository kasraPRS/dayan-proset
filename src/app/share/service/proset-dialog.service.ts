import { Injectable } from "@angular/core";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { ScopeVars } from "../datatable/type";
import { ConfirmDialogComponent } from "../modal-component/confirm-dialog/confirm-dialog.component";
import { InfoDialogComponent } from "../modal-component/info-dialog/info-dialog.component";
import { ChecklistModalComponent } from "../modal-component/checklist-modal/checklist-modal.component";

@Injectable({
  providedIn: "root",
})
export class ProsetDialogService {
  constructor(private matDialog: MatDialog) {}

  showWithComponent(content: any, scope: ScopeVars): MatDialogRef<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = scope.data;
    dialogConfig.width = scope.width?.toString();
    dialogConfig.maxWidth = scope.maxWidth;
    dialogConfig.minWidth = scope.minWidth;
    dialogConfig.disableClose = true;
    return this.matDialog.open(content, dialogConfig);
  }

  showWithFormComponent<T>(
    contentComponent: any,
    scope: ScopeVars,
  ): MatDialogRef<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = scope;
    dialogConfig.width = scope.width?.toString();
    dialogConfig.maxWidth = scope.maxWidth;
    dialogConfig.minWidth = scope.minWidth;
    dialogConfig.disableClose = true;
    return this.matDialog.open(contentComponent, dialogConfig);
  }

  showConfirm(scope: ScopeVars): MatDialogRef<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = scope;
    dialogConfig.width = scope.width?.toString();
    dialogConfig.disableClose = true;
    return this.matDialog.open(ConfirmDialogComponent, dialogConfig);
  }

  showInfo(scope: ScopeVars): MatDialogRef<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = scope;
    dialogConfig.width = scope.width?.toString();
    dialogConfig.disableClose = true;
    return this.matDialog.open(InfoDialogComponent, dialogConfig);
  }

  dismissAll() {
    this.matDialog.closeAll();
  }
}
