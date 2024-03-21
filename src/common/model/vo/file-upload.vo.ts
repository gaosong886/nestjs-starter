import { Expose } from 'class-transformer';

/**
 * 文件上传状态响应封装
 */
export class FileUploadVO {
  @Expose()
  name: string;

  @Expose()
  percent?: number;

  @Expose()
  status: 'error' | 'done' | 'uploading' | 'removed';

  @Expose()
  thumbUrl?: string;

  @Expose()
  uid?: string;

  @Expose()
  url?: string;
}
