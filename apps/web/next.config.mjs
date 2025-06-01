/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:3002/api/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `http://localhost:3002/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;
