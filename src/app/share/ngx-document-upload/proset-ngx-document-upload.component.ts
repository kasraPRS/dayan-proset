import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FilePreviewModel,
  UploaderCaptions,
  ValidationError,
} from "ngx-awesome-uploader";
import { TranslateService } from "@ngx-translate/core";
import { delay, Observable, of } from "rxjs";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ScopeVars } from "../datatable/type";

@Component({
  selector: "proset-ngx-document-upload",
  templateUrl: "./proset-ngx-document-upload.component.html",
  styleUrls: ["./proset-ngx-document-upload.component.less"],
})
export class ProsetNgxDocumentUploadComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private ngbActiveModal: NgbActiveModal,
  ) {}

  uploadedFiles: FilePreviewModel[] = [];

  scopeVars: ScopeVars;

  fileType: string | string[];
  @Output() optionUploadSuccess = new EventEmitter<FilePreviewModel>();

  captions: UploaderCaptions = {
    dropzone: {
      title: this.translateService.instant("ATTACHMENT.DROPZONE.TITLE"),
      or: this.translateService.instant("ATTACHMENT.DROPZONE.OR"),
      browse: this.translateService.instant("ATTACHMENT.DROPZONE.BROWS"),
    },
    cropper: {
      crop: this.translateService.instant("ATTACHMENT.CROPPER.CROP"),
      cancel: this.translateService.instant("ATTACHMENT.CROPPER.CANCEL"),
    },
    previewCard: {
      remove: this.translateService.instant("ATTACHMENT.PREVIEW_CARD.REMOVE"),
      uploadError: this.translateService.instant(
        "ATTACHMENT.PREVIEW_CARD.UPLOAD_ERROR",
      ),
    },
  };

  ngOnInit(): void {}

  onValidationError(error: ValidationError): void {}

  onUploadDocument(): void {
    this.ngbActiveModal.close(this.uploadedFiles);
  }

  onUploadSuccess(event: FilePreviewModel): void {
    this.optionUploadSuccess.emit(event);
  }

  onRemoveSuccess(e: FilePreviewModel) {}

  onFileAdded(file: FilePreviewModel) {
    this.uploadedFiles.push(file);
  }

  validator(file: File): Observable<boolean> {
    if (!file.name.includes("uploader")) {
      return of(true).pipe(delay(2000));
    }
    return of(false).pipe(delay(2000));
  }
}
