/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: "",
  assetPrefix: "",
  env: {
    NEXT_PUBLIC_BASE_PATH: ""
  },
  images: {
    unoptimized: true
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      if (config.optimization) {
        config.optimization.minimize = false;
        config.optimization.minimizer = [];
      }
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
