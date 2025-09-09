/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable source maps in production for easier debugging
  productionBrowserSourceMaps: true,
  images: {
    // Allow loading images from the public directory and remote domains if required
    domains: [],
  },
  // Some three.js modules ship as untranspiled ES modules. By
  // specifying `three` here, Next.js will transpile it when
  // building to avoid errors on older browsers.
  transpilePackages: ['three'],
};
module.exports = nextConfig;
