/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "utfs.io"
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://89.219.32.91:5001'
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: [
          '**/root/**',
          '**/tmp/**',
          '**/var/**',
          '**/proc/**',
          '**/sys/**',
          '**/dev/**',
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**'
        ],
        followSymlinks: false
      }
    }
    return config
  }
}

module.exports = nextConfig
