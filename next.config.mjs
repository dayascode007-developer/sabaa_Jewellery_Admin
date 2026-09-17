import os from "os";

// Next blocks cross-origin requests to /_next dev resources by default, so
// opening the admin panel on a LAN address serves the HTML but never the JS
// chunks — the page renders and nothing is interactive. The machine's own
// LAN addresses are detected here, so it works on whichever laptop runs it and
// keeps working after DHCP hands out a different IP. Same approach as the
// customer site's next.config.mjs.
const lanAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((net) => net && net.family === "IPv4" && !net.internal)
  .map((net) => net.address);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // was: allowedDevOrigins: ['192.168.29.163', 'localhost'],
  allowedDevOrigins: [...new Set(["192.168.29.163", "localhost", ...lanAddresses])],
};

export default nextConfig;
