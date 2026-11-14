/** @type {import('next').NextConfig} */

// Auto-detect GitHub Actions repository name for GitHub Pages basePath (e.g. /HR_SITE)
const isGithubActions = Boolean(process.env.GITHUB_ACTIONS);
let basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

if (!basePath && isGithubActions && process.env.GITHUB_REPOSITORY) {
  const repoName = process.env.GITHUB_REPOSITORY.split('/')[1] || '';
  // Only add repo basePath if not a user/org page like <username>.github.io
  if (repoName && !repoName.toLowerCase().endsWith('.github.io')) {
    basePath = `/${repoName}`;
  }
}

const nextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_GOOGLE_SHEET_ID: '1s9Cru468Qo81ImgNAd4v8xULsWt51wAuQ4AY3nMg7WU',
    NEXT_PUBLIC_SHEET_API_URL: 'https://script.google.com/macros/s/AKfycbwuFLxRE9fBf0nRGb-WaAI6AAHoMabEzdivL9KDAu0sBnP6sDTRtgirwoiYoqdlyfo5/exec',
  },
};

module.exports = nextConfig;
