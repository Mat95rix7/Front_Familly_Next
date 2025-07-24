/** @type {import('next').NextConfig} */
const { IMAGE_HOST } = process.env;
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: IMAGE_HOST || 'localhost',
        // port: IMAGE_PORT || '8000',
        pathname: '/uploads/photos/**',
      },
    ],
  },
};

export default nextConfig;

