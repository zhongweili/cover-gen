/**
 * 图片处理工具
 * 用于处理不同尺寸的图片，确保符合微信公众号封面要求
 */

export interface ImageProcessOptions {
  targetWidth: number;
  targetHeight: number;
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
}

/**
 * 将图片裁剪为指定尺寸
 * @param imageUrl 原始图片 URL 或 base64
 * @param options 处理选项
 * @returns 处理后的 blob URL
 */
export async function cropImageToSize(
  imageUrl: string, 
  options: ImageProcessOptions
): Promise<string> {
  const { targetWidth, targetHeight, quality = 0.9, format = 'png' } = options;
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('无法创建 Canvas 上下文');
        }
        
        // 设置目标尺寸
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // 计算裁剪参数
        const sourceRatio = img.width / img.height;
        const targetRatio = targetWidth / targetHeight;
        
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;
        
        if (sourceRatio > targetRatio) {
          // 原图更宽，需要裁剪左右
          sourceWidth = img.height * targetRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // 原图更高，需要裁剪上下
          sourceHeight = img.width / targetRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }
        
        // 绘制裁剪后的图片
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, targetWidth, targetHeight
        );
        
        // 转换为 blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const blobUrl = URL.createObjectURL(blob);
              resolve(blobUrl);
            } else {
              reject(new Error('图片处理失败'));
            }
          },
          `image/${format}`,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * 将图片转换为微信公众号封面尺寸 (900x388)
 * @param imageUrl 原始图片 URL 或 base64
 * @param quality 图片质量 (0-1)
 * @returns 处理后的 blob URL
 */
export async function convertToWeChatCover(
  imageUrl: string, 
  quality: number = 0.9
): Promise<string> {
  return cropImageToSize(imageUrl, {
    targetWidth: 900,
    targetHeight: 388,
    quality,
    format: 'png'
  });
}

/**
 * 检查图片是否已经是正确的微信封面尺寸
 * @param imageUrl 图片 URL
 * @returns Promise<boolean>
 */
export async function isCorrectWeChatSize(imageUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      resolve(img.width === 900 && img.height === 388);
    };
    
    img.onerror = () => {
      resolve(false);
    };
    
    img.src = imageUrl;
  });
}

/**
 * 获取图片的实际尺寸
 * @param imageUrl 图片 URL
 * @returns Promise<{width: number, height: number}>
 */
export async function getImageDimensions(imageUrl: string): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      reject(new Error('无法获取图片尺寸'));
    };
    
    img.src = imageUrl;
  });
} 
