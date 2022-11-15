/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: './',
  images: {
    loader: 'custom',
    unoptimized: true,
  },
}

module.exports = nextConfig
