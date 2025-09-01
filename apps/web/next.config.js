/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@qa-playwright/shared', '@qa-playwright/prisma'],
}

module.exports = nextConfig