import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ScopeVars } from "../../datatable/type";
import { DescriptionModel } from "../../model/confirm-modal-description.model";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.less"],
})
export class ConfirmDialogComponent implements OnInit {
  @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>();
  title: string;
  scopeVars: ScopeVars;
  contentMessage: string;
  descriptionContent: string;
  content: DescriptionModel;
  warningMessages: string[];
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.scopeVars = data;
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.contentMessage = this.scopeVars.contentMessage!;
    this.warningMessages = this.scopeVars.warningMessages!;
  }

  onSubmitClick(): void {
    if (this.scopeVars.hasDescription) {
      this.content = {
        status: true,
        description: this.descriptionContent,
      };
      this.dialogRef.close(this.content);
    } else {
      this.dialogRef.close(true);
    }
  }
}
