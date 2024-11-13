/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // for the cart session to woek well in development mode
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dwirvaqvo77ym.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
