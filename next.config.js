/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["images.unsplash.com", 
            "www.google.com",       
            'encrypted-tbn2.gstatic.com',
            'encrypted-tbn0.gstatic.com',
            'encrypted-tbn1.gstatic.com',
            'encrypted-tbn3.gstatic.com',]
    },
    eslint: {
        ignoreDuringBuilds: true, // Skips ESLint checks during builds
      },
    reactStrictMode: true,
}

module.exports = nextConfig
