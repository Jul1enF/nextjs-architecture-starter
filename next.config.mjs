/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins : ["192.168.1.12", "192.168.1.69"],
  devIndicators: false,
  images: {
    domains: [],
  },
};

export default nextConfig;
