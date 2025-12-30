import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AttachedFile } from '../model/attached-file.model';
import { UploadFileResponse } from '../model/upload-file-response';
import { GenPreviewLinkResponse } from '../model/gen-preview-link-response';
import { environment } from '../../environments/environment';

const attachedFileAPIUrl = environment.apiBaseUrl + '/v1/attached-files/';
@Injectable({
  providedIn: 'root',
})
export class AttachedFileService {
  constructor(private httpClient: HttpClient) {}

  public uploadFile(
    roomId: number,
    file: File | null
  ): Observable<AttachedFile> {
    let formData = new FormData();
    formData.append('roomId', roomId.toString());
    if (file) {
      formData.append('file', file);
    }

    return this.httpClient
      .post<UploadFileResponse>(attachedFileAPIUrl + 'upload', formData)
      .pipe(map((response) => response.data));
  }

  public genPreviewLinkUpload(
    roomId: number,
    fileId: number | null
  ): Observable<GenPreviewLinkResponse> {
    if (fileId === null) {
      throw new Error('fileId is null');
    }
    let formData = new FormData();
    formData.append('roomId', roomId.toString());
    formData.append('fileId', fileId.toString());

    return this.httpClient.post<GenPreviewLinkResponse>(
      attachedFileAPIUrl + 'gen-preview-link',
      formData
    );
  }

  public downloadFile(roomId: number, fileId: number, fileName: string): void {
    const formData = new FormData();
    formData.append('roomId', roomId.toString());
    formData.append('fileId', fileId.toString());

    this.httpClient
      .post(attachedFileAPIUrl + 'download', formData, {
        responseType: 'blob', // Quan trọng: để nhận file nhị phân
      })
      .subscribe((blob) => {
        this.saveFile(blob, fileName);
      });
  }

  public saveFile(blob: Blob, fileName: string): void {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}
