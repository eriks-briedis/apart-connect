/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  transpilePackages: ["ui", "shared"],
}

module.exports = nextConfig
