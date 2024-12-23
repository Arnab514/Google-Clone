/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["images.unsplash.com", "www.google.com"]
    },
    eslint: {
        ignoreDuringBuilds: true, // Skips ESLint checks during builds
      },
    reactStrictMode: true,
}

module.exports = nextConfig
