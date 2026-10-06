/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Dev only: allow HMR/asset requests when the dev server is viewed through
  // an ngrok tunnel (the free subdomain changes on each restart, hence the
  // wildcard). No effect on production builds.
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.app", "*.ngrok.io"],
};

export default nextConfig;
