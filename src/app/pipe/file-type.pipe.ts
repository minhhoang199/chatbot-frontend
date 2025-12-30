import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileType',
  pure: true // pipe thuần, Angular sẽ cache kết quả nếu input không đổi
})
export class FileTypePipe implements PipeTransform {

  transform(file: File | null): string {
    if (!file) return 'other';

    // nếu là File object (trước khi upload)
    const type = (file as File).type || (file as any).contentType;
    const name = (file as any).fileName || (file as File).name || '';

    if (type) {
      if (type.startsWith('image/')) return 'image';
      if (type.startsWith('video/')) return 'video';
      if (type === 'application/pdf') return 'pdf';
      if (type.includes('word')|| name.endsWith('.doc') || name.endsWith('.docx')) return 'word';
      if (type.includes('excel') || type.includes('spreadsheet') || name.endsWith('.xls') ||name.endsWith('.xlsx')) return 'excel';
      if (type.includes('presentation') || type.includes('powerpoint') || name.endsWith('.pptx')) return 'powerpoint';
    }
    return 'other';
  }
}
