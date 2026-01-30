/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // <--- Essa é a linha mágica para o Docker funcionar bem
  
  // Se você tiver imagens externas (ex: S3, Google), configure aqui depois:
  // images: {
  //   remotePatterns: [ ... ],
  // },
};

module.exports = nextConfig;