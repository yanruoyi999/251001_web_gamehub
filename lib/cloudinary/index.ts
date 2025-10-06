/**
 * Cloudinary Client Configuration
 *
 * 用于图片存储和 CDN 服务
 * - 游戏缩略图 (Thumbnails)
 * - 游戏截图 (Screenshots)
 * - 分类图标 (Icons)
 */

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary 配置
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // 强制使用 HTTPS
});

// Upload Preset 配置
export const CLOUDINARY_PRESETS = {
  THUMBNAIL: process.env.CLOUDINARY_PRESET_THUMBNAIL || 'preset-game-thumbnails',
  SCREENSHOT: process.env.CLOUDINARY_PRESET_SCREENSHOT || 'preset-game-screenshots',
  ICON: process.env.CLOUDINARY_PRESET_ICON || 'preset-category-icons',
} as const;

// 辅助函数：生成 Cloudinary URL
export function getCloudinaryUrl(publicId: string, transformations?: string): string {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('CLOUDINARY_CLOUD_NAME not configured');
    return '';
  }

  const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const transformPart = transformations ? `/${transformations}` : '';
  return `${baseUrl}${transformPart}/${publicId}`;
}

// 辅助函数：生成缩略图 URL
export function getThumbnailUrl(publicId: string, width = 400, height = 300): string {
  return getCloudinaryUrl(publicId, `c_fill,w_${width},h_${height},q_auto,f_auto`);
}

// 辅助函数：生成截图 URL
export function getScreenshotUrl(publicId: string, width = 1280): string {
  return getCloudinaryUrl(publicId, `c_limit,w_${width},q_auto:best,f_auto`);
}

// 辅助函数：删除图片
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
}

// 辅助函数：验证 Cloudinary 连接
export async function verifyCloudinaryConnection(): Promise<boolean> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials not configured');
    }

    // 测试 API 连接（获取账户信息）
    await cloudinary.api.ping();
    return true;
  } catch (error) {
    console.error('Cloudinary connection failed:', error);
    return false;
  }
}

export { cloudinary };
export default cloudinary;
