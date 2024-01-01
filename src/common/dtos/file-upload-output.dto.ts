export class FileUploadOutputDTO {
  name: string;
  percent?: number;
  status: 'error' | 'done' | 'uploading' | 'removed';
  thumbUrl?: string;
  uid?: string;
  url?: string;
}
