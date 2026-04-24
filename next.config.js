/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Old gallery page → homepage (gallery is now on the homepage)
      {
        source: "/projects",
        destination: "/",
        permanent: true,
      },
      // Old project detail pages → new root-level path
      {
        source: "/projects/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
