import { assetPrefixPath } from './config/index.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: assetPrefixPath,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
