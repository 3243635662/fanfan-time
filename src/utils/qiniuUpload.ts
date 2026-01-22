import * as qiniu from 'qiniu-js'
import { getQiNiuTokenAPI } from '@/api/photo'
import type { QiNiuTokenResponse } from '@/types';
interface QiniuUploadOptions {
  file: File;
  key?: string;
  onProgress?: (percent: number) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

/**
 * 生成唯一文件名
 */
function generateFileName(file: File): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = file.name.split('.').pop();
  return `videos/${timestamp}_${random}.${ext}`;
}
// 获取七牛上传token
export const getQiNiuToken = async (key?: string): Promise<QiNiuTokenResponse> => {
  const res = await getQiNiuTokenAPI({ key })
  if (res.code === 0 && res.result) {
    return res.result
  }
  throw new Error(res.message || '获取七牛上传token失败')
}

// 上传文件到七牛云

export async function uploadToQiniu(options: QiniuUploadOptions) {
  const { file, key, onProgress, onSuccess, onError } = options;

  try {
    const { token, domain } = await getQiNiuToken(key)


    // 生成唯一文件名
    const fileName = key || generateFileName(file)

    // 上传文件到七牛云
    const observable = qiniu.upload(file, fileName, token, undefined, {
      useCdnDomain: true,
      region: qiniu.region.z2, // 华南区域，根据你的bucket选择
    });
    // 4. 监听上传进度
    const subscription = observable.subscribe({
      next: (res) => {
        const percent = Math.round(res.total.percent);
        onProgress?.(percent);
      },
      error: (err) => {
        onError?.(new Error(err.message || '上传失败'));
      },
      complete: (res) => {
        // 5. 返回完整的URL
        const url = `${domain}/${res.key}`;
        onSuccess?.(url);
      },
    });

    return subscription;
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error('上传失败'));
  }
}
