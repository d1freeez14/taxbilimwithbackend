/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "utfs.io"
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:5001'
  }
}

module.exports = nextConfig
