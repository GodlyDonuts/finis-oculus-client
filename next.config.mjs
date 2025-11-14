/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // This matches any path starting with /api/python/
        source: "/api/python/:path*",
        // And proxies it to your Cloud Run backend
        destination: "https://finis-oculus-api-376447566369.us-central1.run.app/:path*",
      },
    ];
  },
};

export default nextConfig;