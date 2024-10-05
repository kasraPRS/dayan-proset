import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  FilePreviewModel,
  UploaderCaptions,
  ValidationError,
} from "ngx-awesome-uploader";
import { Observable, delay, of } from "rxjs";

@Component({
  selector: "proset-uploader",
  templateUrl: "./uploader.component.html",
  styleUrl: "./uploader.component.less",
})
export class UploaderComponent {
  constructor(private translateService: TranslateService) {}

  uploadedFiles: FilePreviewModel[] = [];

  fileType: string | string[];

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

  onUploadDocument(): void {}

  onValidationError(error: ValidationError): void {}

  validator(file: File): Observable<boolean> {
    if (!file.name.includes("uploader")) {
      return of(true).pipe(delay(2000));
    }
    return of(false).pipe(delay(2000));
  }

  onUploadSuccess(event: FilePreviewModel): void {}

  onRemoveSuccess(e: FilePreviewModel) {}

  onFileAdded(file: FilePreviewModel) {
    this.uploadedFiles.push(file);
  }
}
