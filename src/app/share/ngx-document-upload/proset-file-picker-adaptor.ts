import {
  FilePickerAdapter,
  FilePreviewModel,
  UploadResponse,
  UploadStatus,
} from "ngx-awesome-uploader";
import { catchError, map, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpEventType } from "@angular/common/http";

@Injectable()
export class ProsetFilePickerAdapter {
  constructor() {}

  uploadFile2(fileItem: FilePreviewModel): Observable<UploadResponse> {
    return new Observable<UploadResponse>().pipe(
      map((res: any) => {
        if (res.type === HttpEventType.Response) {
          const responseFromBackend = res.body;
          return {
            body: responseFromBackend,
            status: UploadStatus.UPLOADED,
          };
        } else if (res.type === HttpEventType.UploadProgress) {
          /** Compute and show the % done: */
          const uploadProgress = +Math.round((100 * res.loaded) / res.total);
          return {
            status: UploadStatus.IN_PROGRESS,
            progress: uploadProgress,
          };
        }
        return {
          status: UploadStatus.IN_PROGRESS,
        };
      }),
      catchError((er) => {
        return of({ status: UploadStatus.ERROR, body: er });
      }),
    );
  }

  // entityType: AttachedToEntityType;
  entityId: number;

  // public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
  //   const form = new FormData();
  //   form.append("file", fileItem.file);
  //
  //   let files: Blob[] = [fileItem.file];
  //   return this.documentApi
  //     .uploadDocument(this.entityId, this.entityType, files, "body", true)
  //     .pipe(
  //       map((res: any) => {
  //         if (res.type === HttpEventType.Response) {
  //           const responseFromBackend = res.body;
  //
  //           return {
  //             body: responseFromBackend,
  //             status: UploadStatus.UPLOADED,
  //           };
  //         } else if (res.type === HttpEventType.UploadProgress) {
  //           /** Compute and show the % done: */
  //           const uploadProgress = +Math.round((100 * res.loaded) / res.total);
  //           return {
  //             status: UploadStatus.IN_PROGRESS,
  //             progress: uploadProgress,
  //           };
  //         }
  //         return {
  //           status: UploadStatus.IN_PROGRESS,
  //         };
  //       }),
  //       catchError((er) => {
  //         return of({ status: UploadStatus.ERROR, body: er });
  //       }),
  //     );
  // }

  removeFile(fileItem: FilePreviewModel): Observable<any> {
    return of(undefined);
  }
}
