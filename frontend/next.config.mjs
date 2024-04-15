/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "build",
    output:"standalone",
    reactStrictMode: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
