import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import { Component, Inject, Input, TemplateRef, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

export interface ModalComponentProps {
  titleTemplateRef?: TemplateRef<any | undefined>;
  bodyTemplateRef?: TemplateRef<any | undefined>;
  ctaTemplateRef?: TemplateRef<any | undefined>;
  actionLess?: boolean;
  title?: string;
  body?: string;
  size?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  dialogOptions?: MatDialogConfig;
  data?: any;
}

@Component({
  selector: "app-modal",
  templateUrl: "./mat-modal.component.html",
  styleUrls: ["./mat-modal.component.less"],
})
export class MatModalComponent {
  @Input() titleTemplateRef: TemplateRef<any> | undefined;
  @Input() bodyTemplateRef: TemplateRef<any> | undefined;
  @Input() ctaTemplateRef: TemplateRef<any> | undefined;
  @Input() actionLess: boolean;

  @Input() title = "Title here";
  @Input() body = "Message here";
  @Input() confirmButtonLabel = "Ok";
  @Input() cancelButtonLabel = "Cancel";

  constructor(
    private dialogRef: MatDialogRef<MatModalComponent>,
    @Inject(MAT_DIALOG_DATA) private passedData: MatModalComponent,
  ) {}

  titleContext = {
    title: this.title,
  };

  ctaContext = {
    close: () => this.dialogRef.close(),
  };

  ngOnInit() {
    this.dialogRef.keydownEvents().subscribe((event) => {
      if (event.key === "Escape") {
        this.onCancel();
      }
    });

    this.dialogRef.backdropClick().subscribe((event) => {
      this.onCancel();
    });
  }

  onCancel(): void {
    this.dialogRef.close(this.passedData);
  }
}
