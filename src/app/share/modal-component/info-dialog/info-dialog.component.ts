import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ScopeVars } from "../../datatable/type";

@Component({
  selector: "app-info-dialog",
  templateUrl: "./info-dialog.component.html",
  styleUrls: ["./info-dialog.component.less"],
})
export class InfoDialogComponent implements OnInit {
  title: string;
  scopeVars: ScopeVars;
  contentMessage: string;

  constructor(
    private dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.scopeVars = data;
  }

  ngOnInit(): void {
    this.title = this.scopeVars.title || "";
    this.contentMessage = this.scopeVars.contentMessage || "";
  }

  onClose() {
    this.dialogRef.close();
  }
}
