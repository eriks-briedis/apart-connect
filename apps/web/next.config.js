/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL || 'https://172-232-134-21.ip.linodeusercontent.com', // @TODO: temporary
  },
  transpilePackages: ["ui", "shared"],
}

module.exports = nextConfig
