// src/lib/assetHelper.ts
// Helper to prepend basePath for GitHub Pages static export

export function getAssetPath(src: string | undefined): string {
  if (!src) return '';
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  ) {
    return src;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const cleanPath = src.startsWith('/') ? src : `/${src}`;
  return `${basePath}${cleanPath}`;
}
