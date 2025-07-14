/** @type {import('next').NextConfig} */

import "./src/env/index.js"

const nextConfig = {
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
