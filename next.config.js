/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "utfs.io"
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:5001'
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['/root', '/tmp', '/var', '**/node_modules']
      }
    }
    return config
  }
}

module.exports = nextConfig
