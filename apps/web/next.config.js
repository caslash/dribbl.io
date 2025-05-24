/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `http://localhost:3002/api/:path*`,
            }
        ]
    }
};

export default nextConfig;
