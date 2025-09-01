/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@qa-playwright/shared', '@qa-playwright/prisma'],
}

module.exports = nextConfig