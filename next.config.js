const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  /** @type {import('next').NextConfig} */
  return {
    reactStrictMode: true,
    // Keep static export behavior for production builds, but avoid it in dev
    // where it can destabilize webpack chunk resolution/HMR.
    ...(isDev ? {} : { output: "export" }),
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
      if (dev) {
        // Disable persistent filesystem cache in dev to prevent stale/missing
        // server chunk references like "./948.js" after hot reloads.
        config.cache = false;
      } else if (config.optimization) {
        // cssnano-simple crashes on the generated global stylesheet in this
        // project, so production minimization must stay disabled until the
        // upstream/minifier issue is resolved.
        config.optimization.minimize = false;
        config.optimization.minimizer = [];
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
};
